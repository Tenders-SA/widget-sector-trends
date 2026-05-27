const widgetStyles = `
.tss-widget {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid;
  position: relative;
  width: 100%;
  max-width: 500px;
  transition: box-shadow 0.2s;
}
.tss-widget:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.tss-widget.tss-light {
  background: #ffffff;
  border-color: #e2e8f0;
}
.tss-widget.tss-dark {
  background: #0f172a;
  border-color: #1e293b;
}

.tss-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid;
}
.tss-light .tss-header {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.tss-dark .tss-header {
  background: #1e293b;
  border-color: #334155;
}

.tss-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tss-header-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  animation: tss-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes tss-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.tss-header-title {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.tss-light .tss-header-title { color: #334155; }
.tss-dark .tss-header-title { color: #e2e8f0; }

.tss-header-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #6366f1;
  text-decoration: none;
  transition: color 0.15s;
}
.tss-header-link:hover {
  color: #4f46e5;
}

.tss-chart {
  position: relative;
  padding: 8px 0 4px;
}

.tss-tooltip {
  display: none;
  position: absolute;
  z-index: 10;
  pointer-events: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.4;
  white-space: nowrap;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.15), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border: 1px solid;
  transform: translate(-50%, -100%);
}
.tss-light .tss-tooltip {
  background: #ffffff;
  border-color: #e2e8f0;
  color: #334155;
}
.tss-dark .tss-tooltip {
  background: #1e293b;
  border-color: #334155;
  color: #cbd5e1;
}

.tss-tooltip-sector {
  font-weight: 700;
  margin-bottom: 4px;
}

.tss-tooltip-value {
  font-weight: 900;
  color: #10b981;
  margin-bottom: 2px;
}

.tss-tooltip-count {
  font-size: 10px;
  opacity: 0.7;
}

.tss-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 10px 16px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.tss-widget:hover .tss-footer {
  opacity: 1;
  pointer-events: auto;
}
.tss-light .tss-footer {
  background: #0f172a;
}
.tss-dark .tss-footer {
  background: #020617;
}

.tss-footer-link {
  font-size: 11px;
  font-weight: 700;
  color: #a5b4fc;
  text-decoration: none;
  transition: color 0.15s;
}
.tss-footer-link:hover {
  color: #c7d2fe;
}

.tss-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
}
.tss-loading-track {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}
.tss-light .tss-loading-track { background: #e2e8f0; }
.tss-dark .tss-loading-track { background: #334155; }

.tss-loading-bar {
  position: absolute;
  left: -40%;
  width: 40%;
  height: 100%;
  border-radius: 2px;
  background: #6366f1;
  animation: tss-shimmer 1s ease-in-out infinite;
}

@keyframes tss-shimmer {
  0% { left: -40%; }
  100% { left: 100%; }
}

.tss-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  text-align: center;
}
.tss-light .tss-error { color: #64748b; }
.tss-dark .tss-error { color: #94a3b8; }

.tss-error-message {
  font-size: 12px;
  line-height: 1.5;
}

.tss-error-retry {
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  transition: background 0.15s;
}
.tss-light .tss-error-retry {
  color: #6366f1;
  border-color: #6366f1;
}
.tss-light .tss-error-retry:hover {
  background: #eef2ff;
}
.tss-dark .tss-error-retry {
  color: #a5b4fc;
  border-color: #a5b4fc;
}
.tss-dark .tss-error-retry:hover {
  background: rgba(165, 180, 252, 0.1);
}

.tss-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  font-size: 12px;
}
.tss-light .tss-empty { color: #94a3b8; }
.tss-dark .tss-empty { color: #64748b; }

.tss-chart svg {
  display: block;
  margin: 0 auto;
}

.tss-chart svg rect {
  transition: opacity 0.15s;
  cursor: pointer;
}
.tss-chart svg rect:hover {
  opacity: 0.8;
}
`

let injected = false

export function injectStyles(): () => void {
  if (injected) return () => {}
  injected = true
  const style = document.createElement('style')
  style.id = 'tss-widget-styles'
  style.textContent = widgetStyles
  document.head.appendChild(style)
  return () => {
    const el = document.getElementById('tss-widget-styles')
    if (el) el.remove()
    injected = false
  }
}
