/**
 * Internal dependencies
 */
import classNames from "classnames";

const Surface = ({ className, ...props }) => {
    const surfaceClasses = classNames("bz-surface", className);

    return <div className={surfaceClasses} {...props} />;
};

export default Surface;
