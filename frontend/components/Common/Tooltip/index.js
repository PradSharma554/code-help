import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({
  title,
  children,
  arrow = true,
  className = {},
  startdelay = 0,
  placement = "auto",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);
  // State to trigger recalculation
  const [recalculate, setRecalculate] = useState(false);

  const calculatePosition = useCallback(() => {
    if (!tooltipRef.current || !triggerRef.current) {
      return;
    }

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // let top, left, isAbove;

    // if (
    //   viewportHeight - triggerRect.bottom < tooltipRect.height &&
    //   triggerRect.top > tooltipRect.height
    // ) {
    //   top = triggerRect.top - tooltipRect.height - 8;
    //   isAbove = true;
    // } else {
    //   top = triggerRect.bottom + 8;
    //   isAbove = false;
    // }

    let top, left, isAbove;

    if (placement === "top") {
      top = triggerRect.top - tooltipRect.height - 8;
      isAbove = true;
    } else if (placement === "bottom") {
      top = triggerRect.bottom + 8;
      isAbove = false;
    } else {
      // auto (existing behavior)
      if (
        viewportHeight - triggerRect.bottom < tooltipRect.height &&
        triggerRect.top > tooltipRect.height
      ) {
        top = triggerRect.top - tooltipRect.height - 8;
        isAbove = true;
      } else {
        top = triggerRect.bottom + 8;
        isAbove = false;
      }
    }

    if (triggerRect.left + tooltipRect.width / 2 > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    } else if (triggerRect.left < tooltipRect.width / 2) {
      left = 8;
    } else {
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    }

    setTooltipStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 50,
      arrowPosition: isAbove ? "bottom" : "top",
    });
  }, [placement]);

  useEffect(() => {
    if (showTooltip) {
      calculatePosition();

      setRecalculate(true);
    }
  }, [showTooltip, calculatePosition]);

  useEffect(() => {
    if (recalculate) {
      calculatePosition();
      setRecalculate(false); // Reset recalculate state
    }
  }, [recalculate, calculatePosition]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const canHover = () => {
    // Only show tooltips where true hovering is available
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  };

  const handleMouseEnter = () => {
    // bail out on devices that don’t support hover
    if (!canHover()) {
      return;
    }
    if (startdelay > 0) {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, startdelay);
    } else {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  return (
    <div className={"relative " + className.root ?? ""}>
      <div
        ref={triggerRef}
        className=""
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {showTooltip &&
        title &&
        createPortal(
          <div
            ref={tooltipRef}
            style={tooltipStyle}
            className="bg-black text-xs text-white px-4 py-2 rounded-md transition-opacity duration-300 text-wrap max-w-80"
          >
            {title}
            {/* Arrow */}
            {arrow && (
              <div
                className="absolute w-2 h-2 bg-black"
                style={{
                  bottom:
                    tooltipStyle.arrowPosition === "bottom" ? "-4px" : "auto",
                  top: tooltipStyle.arrowPosition === "top" ? "-4px" : "auto",
                  left: "50%",
                  transform: "translateX(-50%) rotate(45deg)",
                }}
              ></div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Tooltip;
