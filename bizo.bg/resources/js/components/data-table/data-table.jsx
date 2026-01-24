/**
 * External dependencies
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */

import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import Box from "@/components/box/box";
import Text from "@/components/text/text";
import Select from "@/components/select/select";
import Button from "@/components/button/button";
import TextInput from "@/components/text-input/text-input";
import DateRangePickerReload from "./date-range-picker-reload/date-range-picker-reload";
import { getCurrentHash } from "@/utils/hash-utils";

const HEADER_CONTROL_HEIGHT = 36;

const DataTable = (props) => {
    const {
        columns,
        dataset,
        pagination,
        routes,
        allColumnKeys,
        cellRenderers,
        showDateRangePicker = false,
    } = props;

    const route = useRoute();

    const getCurrentQueryParams = () => {
        const url = new URL(window.location.href);
        return url.searchParams;
    };

    const parseFilterString = (filterValue) => {
        const map = {};
        if (!filterValue) return map;
        filterValue.split(",").forEach((pair) => {
            const [k, v] = pair.split(":");
            if (k) map[k] = decodeURIComponent(v ?? "");
        });
        return map;
    };

    const buildFilterString = (filtersMap) => {
        const parts = Object.entries(filtersMap)
            .filter(([, v]) => v && String(v).trim() !== "")
            .map(([k, v]) => `${k}:${encodeURIComponent(v)}`);
        return parts.join(",");
    };

    const initialSearchParams = useMemo(() => getCurrentQueryParams(), []);

    const [perPage, setPerPage] = useState(
        Number(initialSearchParams.get("perPage")) || pagination?.perPage || 10,
    );

    const [page, setPage] = useState(
        Number(initialSearchParams.get("page")) || pagination?.currentPage || 1,
    );

    const [order, setOrder] = useState(initialSearchParams.get("order") || "");
    const [ancillaryFilter, setAncillaryFilter] = useState(
        initialSearchParams.get("ancillaryFilter") || "",
    );

    // Normalize columns input to support array or object map
    const [displayColumns, internalAllColumnKeys] = useMemo(() => {
        if (Array.isArray(columns)) {
            return [columns, allColumnKeys || columns.map((c) => c.key)];
        }
        if (columns && typeof columns === "object") {
            const entries = Object.entries(columns);
            const visible = entries
                .filter(([, col]) => col && col.isVisible)
                .map(([key, col]) => ({ key, ...col }));
            const keys = Object.keys(columns);
            return [visible, keys];
        }
        return [[], allColumnKeys || []];
    }, [columns, allColumnKeys]);

    const [columnSearch, setColumnSearch] = useState(() => {
        const filters = parseFilterString(
            initialSearchParams.get("filter") || "",
        );
        const allowed = {};
        displayColumns.forEach((c) => {
            if (c.isSearchable && typeof filters[c.key] !== "undefined") {
                allowed[c.key] = filters[c.key];
            }
        });
        return allowed;
    });

    // Debounce per-column search
    const debounceRef = useRef();
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            submitQuery({ resetPage: true });
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [columnSearch]);

    // Build query by merging current URL params with in-memory state
    const buildQueryParams = ({
        resetPage = false,
        ancillaryOverride,
        forExport = false,
        perPageOverride,
    } = {}) => {
        const currentParams = getCurrentQueryParams();
        const query = { ...Object.fromEntries(currentParams.entries()) };

        const filter = buildFilterString(columnSearch);
        if (filter && filter.length > 0) {
            query.filter = filter;
        } else {
            delete query.filter;
        }

        const ancillary =
            typeof ancillaryOverride !== "undefined"
                ? ancillaryOverride
                : ancillaryFilter;
        if (ancillary) {
            query.ancillaryFilter = ancillary;
        } else {
            delete query.ancillaryFilter;
        }

        const currentUrlOrder = currentParams.get("order");
        const effectiveOrder = order || currentUrlOrder;
        if (effectiveOrder) {
            query.order = effectiveOrder;
        } else {
            delete query.order;
        }

        query.perPage =
            typeof perPageOverride !== "undefined" ? perPageOverride : perPage;
        query.page = resetPage || forExport ? 1 : page;

        return query;
    };

    const submitQuery = ({
        resetPage = false,
        ancillaryOverride,
        perPageOverride,
    } = {}) => {
        if (!routes?.index) return;
        const query = buildQueryParams({
            resetPage,
            ancillaryOverride,
            perPageOverride,
        });
        const currentHash = getCurrentHash();
        router.visit(route(routes.index), {
            data: query,
            preserveState: true,
            replace: true,
            only: routes.only || [],
            onSuccess: () => {
                if (currentHash) {
                    const { pathname, search } = window.location;
                    history.replaceState(
                        window.history.state,
                        "",
                        `${pathname}${search}${currentHash}`,
                    );
                }
            },
        });
    };

    const handleSort = (columnKey) => {
        const [currentCol, currentDir] = (order || ",").split(",");
        let nextDir = "asc";
        if (currentCol === columnKey) {
            nextDir = currentDir === "asc" ? "desc" : "asc";
        }
        setOrder(`${columnKey},${nextDir}`);
        setPage(1);
        submitQuery({ resetPage: true });
    };

    const normalizePerPageChange = (valueOrEventOrOption) => {
        if (typeof valueOrEventOrOption === "number")
            return valueOrEventOrOption;
        if (valueOrEventOrOption && valueOrEventOrOption.target) {
            const raw = valueOrEventOrOption.target.value;
            return Number(raw);
        }
        if (
            valueOrEventOrOption &&
            typeof valueOrEventOrOption.value !== "undefined"
        ) {
            return Number(valueOrEventOrOption.value);
        }
        return Number(valueOrEventOrOption);
    };

    const handlePerPageChange = (valueOrEventOrOption) => {
        const value = normalizePerPageChange(valueOrEventOrOption);
        setPerPage(value);
        setPage(1);
        submitQuery({ resetPage: true, perPageOverride: value });
    };

    const goToPageUrl = (url) => {
        if (!url) return;
        const currentHash = getCurrentHash();
        router.visit(url, {
            preserveState: true,
            replace: true,
            only: routes.only || [],
            onSuccess: () => {
                if (currentHash) {
                    const { pathname, search } = window.location;
                    history.replaceState(
                        window.history.state,
                        "",
                        `${pathname}${search}${currentHash}`,
                    );
                }
            },
        });
    };

    const exportWithCurrentQuery = () => {
        if (!routes?.export) return;
        const query = buildQueryParams({ forExport: true, resetPage: true });
        window.location.href = route(routes.export, query);
    };

    const [currentSortCol, currentSortDir] = useMemo(() => {
        const [c, d] = (order || ",").split(",");
        return [c, d];
    }, [order]);

    // Map current per-page numeric value to the option object expected by ReactSelect
    const perPageOptions = pagination?.perPageOptions || [];
    const perPageSelectedOption = useMemo(() => {
        const found = perPageOptions.find(
            (opt) => Number(opt.value) === Number(perPage),
        );
        return (
            found ||
            (perPage != null
                ? { value: perPage, label: String(perPage) }
                : null)
        );
    }, [perPage, perPageOptions]);

    return (
        <Box className="bz-data-table">
            <BlockStack gap="600">
                <InlineStack
                    align={showDateRangePicker ? "space-between" : "flex-end"}
                    blockAlign="center"
                >
                    {showDateRangePicker && (
                        <InlineStack gap="300">
                            <Text>Период:</Text>
                            <DateRangePickerReload loadOnly={routes?.only} />
                        </InlineStack>
                    )}
                    <InlineStack gap="300">
                        <Select
                            value={perPageSelectedOption}
                            onChange={handlePerPageChange}
                            options={perPageOptions}
                        />
                        <Button
                            variant="secondary"
                            size="large"
                            onClick={exportWithCurrentQuery}
                        >
                            <Text>Експорт</Text>
                        </Button>
                    </InlineStack>
                </InlineStack>

                <Box className="bz-table-wrapper">
                    <table className="bz-table">
                        <thead>
                            <tr>
                                {displayColumns.map((col) => {
                                    const isSorted = currentSortCol === col.key;
                                    return (
                                        <th
                                            className={`bz-table__th ${col.isSearchable ? "bz-table__th--searchable" : ""}`}
                                            key={col.key}
                                        >
                                            <InlineStack
                                                gap="200"
                                                blockAlign="center"
                                                className="bz-table__header-bar"
                                                wrap={false}
                                            >
                                                <Box className="bz-table__title-zone">
                                                    <Text className="bz-table__title">
                                                        {col.isSearchable &&
                                                        (
                                                            columnSearch[
                                                                col.key
                                                            ] ?? ""
                                                        ).trim() !== ""
                                                            ? columnSearch[
                                                                  col.key
                                                              ]
                                                            : col.label}
                                                    </Text>

                                                    {col.isSearchable && (
                                                        <Box
                                                            className="bz-table__input-wrapper"
                                                            dangerouslySetInlineStyle={{
                                                                __style: {
                                                                    "--bz-text-input-height": `${HEADER_CONTROL_HEIGHT}px`,
                                                                },
                                                            }}
                                                        >
                                                            <TextInput
                                                                placeholder={
                                                                    col.label
                                                                }
                                                                value={
                                                                    columnSearch[
                                                                        col.key
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    setColumnSearch(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [col.key]:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }),
                                                                    )
                                                                }
                                                            />
                                                        </Box>
                                                    )}
                                                </Box>

                                                {col.hasSortControl && (
                                                    <>
                                                        <span
                                                            className="bz-table__sort-glyph"
                                                            onClick={() =>
                                                                handleSort(
                                                                    col.key,
                                                                )
                                                            }
                                                        >
                                                            <Text>
                                                                {isSorted
                                                                    ? currentSortDir ===
                                                                      "asc"
                                                                        ? "▲"
                                                                        : "▼"
                                                                    : "↕"}
                                                            </Text>
                                                        </span>
                                                    </>
                                                )}
                                            </InlineStack>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {dataset.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {displayColumns.map((col) => {
                                        const Renderer =
                                            cellRenderers?.[col.key];
                                        return (
                                            <td key={`${rowIndex}-${col.key}`}>
                                                {Renderer ? (
                                                    <Renderer
                                                        datarow={row}
                                                        colKey={col.key}
                                                    />
                                                ) : (
                                                    <Text>{row[col.key]}</Text>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>

                <InlineStack align="space-between" blockAlign="center">
                    <Text>
                        {pagination?.firstItemNumber}–
                        {pagination?.lastItemNumber} / {pagination?.total}
                    </Text>
                    <InlineStack gap="300">
                        <Button
                            variant="secondary"
                            size="large"
                            disabled={!pagination?.previousPageUrl}
                            onClick={() =>
                                goToPageUrl(pagination?.previousPageUrl)
                            }
                        >
                            <Text>Предишна</Text>
                        </Button>
                        <Button
                            variant="secondary"
                            size="large"
                            disabled={!pagination?.nextPageUrl}
                            onClick={() => goToPageUrl(pagination?.nextPageUrl)}
                        >
                            <Text>Следваща</Text>
                        </Button>
                    </InlineStack>
                </InlineStack>
            </BlockStack>
        </Box>
    );
};

export default DataTable;
