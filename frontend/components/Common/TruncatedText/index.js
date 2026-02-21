import { isValidElement, useEffect, useState } from "react";
import Tooltip from "../Tooltip";

const breakpoints = {
  xs: 10,
  sm: 640,
  md: 720,
  lg: 850,
  xl: 1280,
  "2xl": 1536,
};

function getResponsiveLimit(limitConfig, width) {
  if (typeof limitConfig === "number") return limitConfig;

  let resolved = limitConfig.base ?? limitConfig.xs ?? Infinity;

  for (const [key, px] of Object.entries(breakpoints)) {
    if (width >= px && limitConfig[key] !== undefined) {
      resolved = limitConfig[key];
    }
  }

  return resolved;
}

export default function TruncatedText({
  textWrap = false,
  children,
  limit = 20,
  className = "",
  as: Component = "span",
  tooltipEnabled = true,
  ...props
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resolvedLimit = getResponsiveLimit(limit, windowWidth);

  let content = isValidElement(children)
    ? children.props.children
    : typeof children === "string" || typeof children === "number"
      ? String(children)
      : "";

  const isTruncated = content.length > resolvedLimit;
  const displayText = isTruncated
    ? content.slice(0, resolvedLimit).trimEnd() + "…"
    : content;

  if (textWrap && isTruncated) {
    content = content.match(new RegExp(`.{1,${20}}`, "g"));
    content = content.join("\n");
  }
  return (
    <Tooltip title={isTruncated && tooltipEnabled && content} startdelay={500}>
      <Component
        className={`inline-block !line-clamp-1 ${className}`}
        aria-label={content}
        {...props}
      >
        {displayText}
      </Component>
    </Tooltip>
  );
}
