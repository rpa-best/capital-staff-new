import {NavLink, NavLinkProps} from "react-router-dom";
import { useRoutePrefix } from "../../../hooks/useRoutePrefix";

interface PrefixedNavLinkProps extends NavLinkProps {
    to: string;
}

const PrefixedNavLink = ({ to, ...props }: PrefixedNavLinkProps) => {
    const { prefix } = useRoutePrefix();
    
    const prefixedTo = prefix ? `/${prefix}${to}` : to;
    
    return <NavLink {...props} to={prefixedTo} />
};

export default PrefixedNavLink