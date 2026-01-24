/**
 * External dependencies
 */
import { usePage } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import AppBar from "@/components/app-bar/app-bar";
import Footer from "@/components/footer/footer";
import IconUser from "@/components/icons/user";
import IconCar from "@/components/icons/car";
import IconPayment from "@/components/icons/payment";
import IconProperty from "@/components/icons/property";
import IconDashboard from "@/components/icons/dashboard";
import IconMTPLInsurance from "@/components/icons/mtpl-insurance";
import IconPropertyInsurance from "@/components/icons/property-insurance";
import IconNonResidentInsurance from "@/components/icons/non-resident-insurance";
import IconLifeInsurance from "@/components/icons/life-insurance";
import IconLogin from "@/components/icons/login";
import IconUsers from "@/components/icons/users";
import IconDocument from "@/components/icons/document";
import IconSupport from "@/components/icons/support";
import IconShield from "@/components/icons/shield";
import IconLock from "@/components/icons/lock";
import IconMVRFines from "@/components/icons/mvr-fines";
import IconVignetteCheck from "@/components/icons/vignette-check";
import IconVehicleInspection from "@/components/icons/vehicle-inspection";
import { NavigationContext } from "@/layouts/app-layout/contexts/navigation-context";

const sideNavigationItems = [
    {
        key: "dashboard",
        icon: IconDashboard,
        title: "Дашборд",
        href: "dashboard",
    },

    {
        key: "insurances",
        icon: IconLock,
        title: "Застраховане",
        href: "welcome",
        children: [
            {
                key: "insurance",
                title: "Гражданска отговорност",
                label: "Сигурност за автомобила ти, грижа за теб.",
                href: "mtpl-insurance",
                icon: IconMTPLInsurance,
            },
            {
                key: "home-insurance",
                title: "Застраховка имущество",
                label: "Защити дома си – най-ценната крепост.",
                href: "home-insurance",
                icon: IconPropertyInsurance,
            },
            {
                key: "non-resident-insurance",
                title: "Медицинска застраховка за чужденци",
                label: "Здравна грижа от деня, в който пристигнеш.",
                href: "non-resident-insurance",
                icon: IconNonResidentInsurance,
            },
            {
                key: "travel-insurance",
                title: "Застраховка при пътуване в чужбина",
                label: "Приключения без притеснения.",
                href: "travel-insurance",
                icon: IconLifeInsurance,
            },
        ],
    },
    {
        key: "services",
        icon: IconCar,
        title: "Услуги",
        href: "welcome",
        children: [
            {
                key: "vehicle-inspection",
                title: "Проверка на срок на ГТП",
                label: "Увери се, че техническият ти преглед е изряден.",
                href: "vehicle-inspection",
                icon: IconVehicleInspection,
            },
            {
                key: "mtpl-check",
                title: "Проверка на ГО",
                label: "Увери се, че застраховката ти е активна.",
                href: "mtpl-check",
                icon: IconMTPLInsurance,
            },
            {
                key: "vignette-check",
                title: "Проверка на винетка",
                label: "Увери се, че винетката ти е валидна.",
                href: "vignette-check",
                icon: IconVignetteCheck,
            },
            {
                key: "mvr-fines-check",
                title: "Проверка на глоби от МВР",
                label: "Увери се, че нямаш глоби от МВР.",
                href: "mvr-fines-check",
                icon: IconMVRFines,
            },
        ],
    },
    {
        key: "properties",
        icon: IconProperty,
        title: "Имоти",
        href: "properties.index",
    },
    {
        key: "persons",
        icon: IconUsers,
        title: "Застраховани лица",
        href: "persons.index",
    },
    {
        key: "vehicles",
        icon: IconCar,
        title: "Автомобили",
        href: "vehicles.index",
    },
    {
        key: "policies",
        icon: IconDocument,
        title: "Застраховки",
        href: "policies.index",
    },
    {
        key: "installments",
        icon: IconPayment,
        title: "Плащания",
        href: "installments.index",
    },
    {
        key: "profile",
        icon: IconUser,
        title: "Профил",
        href: "profile",
    },
    {
        key: "help",
        icon: IconSupport,
        title: "Помощ",
        href: "welcome",
    },
];

const profileMenuItems = [
    {
        key: "profile",
        title: "Профил",
        icon: IconUser,
        href: "profile",
    },
    {
        key: "dashboard",
        title: "Дашборд",
        icon: IconDashboard,
        href: "dashboard",
    },
    {
        key: "logout",
        title: "Изход",
        icon: IconLogin,
        href: "logout",
    },
];

const mainNavItems = [
    {
        key: "index",
        title: "Начало",
        href: "welcome",
    },
    {
        key: "insurances",
        title: "Застраховане",
        href: "welcome",
        children: [
            {
                key: "mtpl-insurance",
                title: "Гражданска отговорност",
                label: "Сигурност за автомобила ти, грижа за теб.",
                href: "mtpl-insurance",
                icon: IconMTPLInsurance,
            },
            {
                key: "home-insurance",
                title: "Застраховка имущество",
                label: "Защити дома си – най-ценната крепост.",
                href: "home-insurance",
                icon: IconPropertyInsurance,
            },
            {
                key: "non-resident-insurance",
                title: "Медицинска застраховка за чужденци",
                label: "Здравна грижа от деня, в който пристигнеш.",
                href: "non-resident-insurance",
                icon: IconNonResidentInsurance,
            },
            {
                key: "travel-insurance",
                title: "Застраховка при пътуване в чужбина",
                label: "Приключения без притеснения.",
                href: "travel-insurance",
                icon: IconLifeInsurance,
            },
        ],
    },
    {
        key: "services",
        title: "Услуги",
        href: "welcome",
        children: [
            {
                key: "vehicle-inspection",
                title: "Проверка на срок на ГТП",
                label: "Увери се, че техническият ти преглед е изряден.",
                href: "vehicle-inspection",
                icon: IconVehicleInspection,
            },
            {
                key: "mtpl-check",
                title: "Проверка на ГО",
                label: "Увери се, че застраховката ти е активна.",
                href: "mtpl-check",
                icon: IconMTPLInsurance,
            },
            {
                key: "vignette-check",
                title: "Проверка на винетка",
                label: "Увери се, че винетката ти е валидна.",
                href: "vignette-check",
                icon: IconVignetteCheck,
            },
            {
                key: "mvr-fines-check",
                title: "Проверка на глоби от МВР",
                label: "Увери се, че нямаш глоби от МВР.",
                href: "mvr-fines-check",
                icon: IconMVRFines,
            },
        ],
    },
    { key: "contacts", title: "Контакти", href: "welcome" },
];

const adminSideNavigationItems = [
    {
        key: "admin-policies",
        icon: IconShield,
        title: "Полици",
        href: "policies.admin.index",
    },
    {
        key: "admin-payments",
        icon: IconPayment,
        title: "Плащания",
        href: "payments.admin.index",
    },
];

const AppLayout = (props) => {
    //const isDevelopment = import.meta.env.VITE_APP_ENV === 'development'
    const { children } = props;
    const { auth } = usePage().props;
    const role = auth?.user?.role?.[0]?.name;
    const [headerBarTitle, setHeaderBarTitle] = useState(null);
    const isAdmin = role === "admin";
    const route = useRoute();
    const currentRouteName = route().current();

    // if user is not authenticated remove items from sideNavigationItems remove dashboard, properties, persons, vehicles, policies, installments, profile
    const mobileNavigationItems = useMemo(() => {
        return auth?.user?.id
            ? sideNavigationItems
            : sideNavigationItems.filter(
                  (item) =>
                      item.key !== "dashboard" &&
                      item.key !== "properties" &&
                      item.key !== "persons" &&
                      item.key !== "vehicles" &&
                      item.key !== "policies" &&
                      item.key !== "installments" &&
                      item.key !== "profile",
              );
    }, [auth?.user?.id]);

    // Generate className from route name (e.g., "welcome" -> "bz-app-layout--route-welcome")
    const routeClassName = currentRouteName
        ? `bz-app-layout--route-${currentRouteName.replace(/\./g, "-")}`
        : "";

    const layoutClassName = `bz-app-layout ${routeClassName}`.trim();

    return (
        <NavigationContext.Provider
            value={{
                sideNavigationItems: auth?.user
                    ? isAdmin
                        ? adminSideNavigationItems
                        : sideNavigationItems
                    : [],
                mainNavItems,
                mobileNavigationItems,
                profileMenuItems,
                headerBarTitle,
                setHeaderBarTitle,
            }}
        >
            <div className={layoutClassName}>
                <div className="bz-app-layout__header">
                    <AppBar />
                </div>

                <div className="bz-app-layout__content">{children}</div>

                <div className="bz-app-layout__footer">
                    <Footer />
                </div>
            </div>
        </NavigationContext.Provider>
    );
};

AppLayout.wrap = (Component) => {
    Component.layout = (page) => <AppLayout>{page}</AppLayout>;

    return Component;
};

export default AppLayout;
