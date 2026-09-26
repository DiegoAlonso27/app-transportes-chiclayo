/* @ds-bundle: {"format":4,"namespace":"TransportesChiclayoDesignSystem_48bc0c","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"bd544a718e77","components/forms/TextField.jsx":"8eba2ac094ad","components/layout/Card.jsx":"316181d39ec0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TransportesChiclayoDesignSystem_48bc0c = window.TransportesChiclayoDesignSystem_48bc0c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
/**
 * Button component
 * Filled, outlined, and text variants
 * Primary, secondary, error states
 */
function Button({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  fullWidth = false,
  startIcon,
  endIcon
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: 1.43,
    letterSpacing: '0.1px',
    border: 'none',
    borderRadius: 'var(--radius-xs)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    minHeight: size === 'small' ? '40px' : size === 'large' ? '56px' : '48px',
    padding: size === 'small' ? '8px 12px' : size === 'large' ? '12px 24px' : '12px 16px'
  };
  const colorMap = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    error: 'var(--color-error)'
  };
  const variantStyles = {
    filled: {
      backgroundColor: colorMap[color],
      color: color === 'secondary' ? 'var(--text-primary)' : 'var(--text-on-primary)'
    },
    outlined: {
      backgroundColor: 'transparent',
      color: colorMap[color],
      border: `1px solid ${colorMap[color]}`
    },
    text: {
      backgroundColor: 'transparent',
      color: colorMap[color]
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    style: {
      ...baseStyles,
      ...variantStyles[variant]
    },
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: e => !disabled && (e.currentTarget.style.opacity = '0.92'),
    onMouseLeave: e => !disabled && (e.currentTarget.style.opacity = '1'),
    onMouseDown: e => !disabled && (e.currentTarget.style.opacity = '0.85'),
    onMouseUp: e => !disabled && (e.currentTarget.style.opacity = '0.92')
  }, startIcon, children, endIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
/**
 * TextField component
 * Outlined Material Design 3 input
 */
function TextField({
  label,
  value = '',
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
  startIcon,
  endIcon
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      width: fullWidth ? '100%' : 'auto'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 'var(--label-medium-size)',
      fontWeight: 500,
      color: 'var(--text-primary)',
      marginBottom: '4px'
    }
  }, label, " ", required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-error)'
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-outline-variant)'}`,
      borderRadius: 'var(--radius-sm)',
      padding: '0 12px',
      height: '52px',
      backgroundColor: disabled ? 'var(--surface-dim)' : 'var(--surface-2)',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      gap: '8px'
    }
  }, startIcon && /*#__PURE__*/React.createElement("span", null, startIcon), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    placeholder: placeholder,
    disabled: disabled,
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontFamily: 'var(--font-family)',
      fontSize: 'var(--body-medium-size)',
      backgroundColor: 'transparent',
      color: 'var(--text-primary)'
    },
    onFocus: e => {
      e.currentTarget.parentElement.style.borderColor = error ? 'var(--color-error)' : 'var(--color-primary)';
    },
    onBlur: e => {
      e.currentTarget.parentElement.style.borderColor = error ? 'var(--color-error)' : 'var(--color-outline-variant)';
    }
  }), endIcon && /*#__PURE__*/React.createElement("span", null, endIcon)), helperText && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--label-small-size)',
      color: error ? 'var(--color-error)' : 'var(--text-tertiary)',
      marginTop: '4px'
    }
  }, helperText));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
/**
 * Card component
 * Wrapper for grouped content
 */
function Card({
  children,
  elevated = true,
  padding = 'lg',
  onClick
}) {
  const paddingMap = {
    none: '0px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: 'var(--surface-2)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: elevated ? 'var(--shadow-card)' : 'none',
      padding: paddingMap[padding],
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
    },
    onClick: onClick,
    onMouseEnter: e => elevated && (e.currentTarget.style.boxShadow = 'var(--shadow-2)'),
    onMouseLeave: e => elevated && (e.currentTarget.style.boxShadow = 'var(--shadow-1)')
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.Card = __ds_scope.Card;

})();
