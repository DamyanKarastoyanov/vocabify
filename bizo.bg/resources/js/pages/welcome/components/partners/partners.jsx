/**
 * Internal dependencies
 */
import IconLogoArmeec from "@/components/icons/logo-armeec";
import IconLogoGenerali from "@/components/icons/logo-generali";
import IconLogoBul from "@/components/icons/logo-bul";
import IconLogoDZI from "@/components/icons/logo-dzi";
import IconLogoBulstrad from "@/components/icons/logo-bulstrad";
import IconAxiomLogo from "@/components/icons/axiom-logo";

const partners = [
    {
        id: "axiom",
        name: "Axiom",
        icon: IconAxiomLogo,
        width: 100,
        height: 33,
        url: "https://www.axiom.bg/",
    },
    {
        id: "armeec",
        name: "Armeec",
        icon: IconLogoArmeec,
        width: 170,
        height: 59,
    },
    {
        id: "generali",
        name: "Generali",
        icon: IconLogoGenerali,
        width: 65,
        height: 45,
    },
    { id: "bul", name: "Bul Ins", icon: IconLogoBul, width: 148, height: 45 },
    { id: "dzi", name: "DZI", icon: IconLogoDZI, width: 63, height: 47 },
    /*{
        id: "bulstrad",
        name: "Bulstrad",
        icon: IconLogoBulstrad,
        width: 150,
        height: 37,
    },*/
];

const Partners = () => {
    return (
        <section className="bz-partners">
            <div className="bz-partners__container">
                {partners.map((partner) => (
                    <div
                        key={partner.id}
                        className="bz-partners__item"
                        style={{
                            "--partner-width": `${partner.width}px`,
                            "--partner-height": `${partner.height}px`,
                        }}
                        onClick={() => window.open(partner?.url, "_blank")}
                    >
                        <div className="bz-partners__logo">{partner.icon}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Partners;
