/**
 * External dependencies
 */
import { Link } from "@inertiajs/react";

/**
 * LogoLink Component
 *
 * @param {Object} insurer - The insurer object containing name, url, logo, and alt
 */
const LogoLink = (props) => {
    const { insurer } = props;
    return (
        <Link
            href={insurer.url}
            as="a"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                e.preventDefault();
                window.open(insurer.url, "_blank", "noopener,noreferrer");
            }}
        >
            <img src={insurer.logo} alt={insurer.alt} />
        </Link>
    );
};

export default LogoLink;
