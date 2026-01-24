/**
 * Internal dependencies
 */
import Menu from "@/components/menu/menu";
import Button from "@/components/button/button";
import Icon from "@/components/icon/icon";
import IconCaretRight from "@/components/icons/caret-right";
import InlineStack from "@/components/inline-stack/inline-stack";
import IconCalendarCheck from "@/components/icons/calendar-check";
import IconImages from "@/components/icons/images";
import IconBuildings from "@/components/icons/buildings";
import IconQuestionMarkStacked from "@/components/icons/question-mark-stacked";
import IconChartLineUp from "@/components/icons/chart-line-up";
import IconArrowCircleDown from "@/components/icons/arrow-circle-down";
import IconStarStacked from "@/components/icons/star-stacked";

export default {
    title: "Pastel/Menu",
    component: Menu,
};

export const Default = {
    render: (args) => {
        return (
            <div style={{ maxWidth: "200px" }}>
                <Menu>
                    <Menu.Trigger>
                        <Menu.Button
                            icon={
                                <Icon size="400" icon={IconArrowCircleDown} />
                            }
                        >
                            Menu button
                        </Menu.Button>
                    </Menu.Trigger>

                    <Menu.Popover>
                        <Menu.List>
                            <Menu.Item
                                onClick={() => alert("clicked option 1")}
                            >
                                As copy
                            </Menu.Item>

                            <Menu.Item
                                onClick={() => alert("clicked option 2")}
                            >
                                As print
                            </Menu.Item>

                            <Menu.Item
                                onClick={() => alert("clicked option 3")}
                            >
                                As excel
                            </Menu.Item>
                        </Menu.List>
                    </Menu.Popover>
                </Menu>
            </div>
        );
    },
};

export const WithIcons = {
    render: (args) => {
        return (
            <div style={{ maxWidth: "200px" }}>
                <Menu>
                    <Menu.Trigger>
                        <Button
                            suffix={<Icon size="400" icon={IconCaretRight} />}
                            variant="plain"
                        >
                            Create a New Post
                        </Button>
                    </Menu.Trigger>

                    <Menu.Popover>
                        <Menu.List>
                            <Menu.Item
                                onClick={() => alert("clicked option 1")}
                            >
                                <InlineStack gap="100" blockAlign="center">
                                    <Icon size="400" icon={IconStarStacked} />
                                    Reviews
                                </InlineStack>
                            </Menu.Item>

                            <Menu.Item
                                onClick={() => alert("clicked option 2")}
                            >
                                <InlineStack gap="100" blockAlign="center">
                                    <Icon size="400" icon={IconCalendarCheck} />
                                    Posts
                                </InlineStack>
                            </Menu.Item>

                            <Menu.Item
                                onClick={() => alert("clicked option 3")}
                            >
                                <InlineStack gap="100" blockAlign="center">
                                    <Icon size="400" icon={IconImages} />
                                    Gallery
                                </InlineStack>
                            </Menu.Item>

                            <Menu.Item
                                onClick={() => alert("clicked option 3")}
                            >
                                <InlineStack gap="100" blockAlign="center">
                                    <Icon size="400" icon={IconBuildings} />
                                    Amenities
                                </InlineStack>
                            </Menu.Item>

                            <Menu.Item
                                onClick={() => alert("clicked option 3")}
                            >
                                <InlineStack gap="100" blockAlign="center">
                                    <Icon
                                        size="400"
                                        icon={IconQuestionMarkStacked}
                                    />
                                    Questions
                                </InlineStack>
                            </Menu.Item>

                            <Menu.Item
                                onClick={() => alert("clicked option 3")}
                            >
                                <InlineStack gap="100" blockAlign="center">
                                    <Icon size="400" icon={IconChartLineUp} />
                                    Keywords
                                </InlineStack>
                            </Menu.Item>
                        </Menu.List>
                    </Menu.Popover>
                </Menu>
            </div>
        );
    },
};
