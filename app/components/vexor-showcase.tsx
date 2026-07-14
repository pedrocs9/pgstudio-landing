type VexorShowcaseProps = {
  variant?: 'hero' | 'pos' | 'compact'
}

const products = [
  ['SKU PR-104', 'Serum vitamina C', 'Dermocosmetica', '8 uds', '$12.990'],
  ['SKU PR-221', 'Crema hidratante', 'Rostro', '14 uds', '$9.490'],
  ['SKU PR-318', 'Shampoo argan', 'Capilar', '3 uds', '$6.990'],
  ['SKU PR-402', 'Protector solar FPS50', 'Solar', '2 uds', '$11.990'],
]

const cart = [
  ['Serum vitamina C', '1', '$12.990'],
  ['Crema hidratante', '2', '$18.980'],
  ['Shampoo argan', '1', '$6.990'],
]

export default function VexorShowcase({ variant = 'hero' }: VexorShowcaseProps) {
  if (variant === 'compact') return <DashboardPanel compact />

  return (
    <div className={`vexor-product-frame ${variant}`} aria-label="Composicion visual de la interfaz de Vexor para Perfumeria Aurora">
      <div className="vexor-app-chrome">
        <div>
          <strong>Vexor</strong>
          <span>Perfumeria Aurora</span>
        </div>
        <span className="live-pill">Caja abierta</span>
      </div>

      <div className="vexor-app-body">
        <aside className="vexor-app-nav" aria-hidden="true">
          {['Dashboard', 'POS', 'Inventario', 'Clientes', 'Compras'].map((item) => (
            <span key={item} className={item === 'POS' ? 'active' : ''}>{item}</span>
          ))}
        </aside>

        <div className="vexor-screen-stack">
          {variant === 'hero' && <DashboardPanel />}
          <PosPanel />
          {variant === 'hero' && (
            <div className="support-grid">
              <InventoryPanel />
              <CustomerPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PosPanel() {
  return (
    <section className="product-panel pos-panel-real" aria-label="Punto de venta Vexor con carrito, cliente, pagos y teclado">
      <div className="panel-head">
        <div>
          <span>POS</span>
          <strong>Nueva venta</strong>
        </div>
        <span className="barcode-pill">Barcode activo</span>
      </div>

      <div className="pos-layout-real">
        <div>
          <div className="search-field">Buscar producto por nombre, SKU o codigo de barras</div>
          <div className="product-grid-real">
            {products.map(([sku, name, category, stock, price]) => (
              <article key={sku}>
                <span>{sku}</span>
                <strong>{name}</strong>
                <small>{category} · Stock {stock}</small>
                <b>{price}</b>
              </article>
            ))}
          </div>
        </div>

        <div className="cart-panel-real">
          <div className="customer-strip">
            <span>Cliente</span>
            <strong>Camila Rojas</strong>
            <small>Historial y deuda visibles</small>
          </div>
          <div className="cart-lines">
            {cart.map(([name, qty, price]) => (
              <div key={name}>
                <span>{qty}x {name}</span>
                <strong>{price}</strong>
              </div>
            ))}
          </div>
          <div className="payment-row">
            <span>Efectivo</span>
            <span>Tarjeta</span>
            <span>Fiado</span>
          </div>
          <div className="keypad-real" aria-hidden="true">
            {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((key) => <span key={key}>{key}</span>)}
          </div>
          <div className="total-real">
            <span>Total</span>
            <strong>$38.960</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DashboardPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`product-panel dashboard-panel-real ${compact ? 'compact' : ''}`} aria-label="Dashboard Vexor con ventas, metricas, actividad y alertas">
      <div className="panel-head">
        <div>
          <span>Dashboard</span>
          <strong>Resumen de hoy</strong>
        </div>
        <span className="soft-pill">Perfumeria Aurora</span>
      </div>
      <div className="metric-strip-real">
        <div><span>Ventas</span><strong>$486.700</strong></div>
        <div><span>Operaciones</span><strong>34</strong></div>
        <div><span>Stock bajo</span><strong>5</strong></div>
      </div>
      <div className="activity-grid-real">
        <div className="activity-list-real">
          <span>Actividad reciente</span>
          <p>Venta POS · Camila Rojas · $38.960</p>
          <p>Compra proveedor · BellezaPro · 24 unidades</p>
          <p>Alerta stock · Protector solar FPS50</p>
        </div>
        <div className="alert-card-real">
          <span>Alerta</span>
          <strong>Reposicion sugerida</strong>
          <small>5 productos bajo minimo configurado.</small>
        </div>
      </div>
    </section>
  )
}

export function InventoryPanel() {
  return (
    <section className="product-panel inventory-panel-real" aria-label="Inventario Vexor con productos, stock, alertas y categorias">
      <div className="panel-head compact-head">
        <div>
          <span>Inventario</span>
          <strong>Productos y stock</strong>
        </div>
      </div>
      <div className="inventory-table-real">
        {products.slice(0, 3).map(([sku, name, category, stock]) => (
          <div key={sku}>
            <span>{name}</span>
            <small>{category}</small>
            <strong className={stock.startsWith('2') || stock.startsWith('3') ? 'low' : ''}>{stock}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

export function CustomerPanel() {
  return (
    <section className="product-panel customer-panel-real" aria-label="Clientes Vexor con historial, deuda y compras">
      <div className="panel-head compact-head">
        <div>
          <span>Clientes</span>
          <strong>Camila Rojas</strong>
        </div>
      </div>
      <div className="customer-detail-real">
        <div><span>Ultima compra</span><strong>$38.960</strong></div>
        <div><span>Deuda</span><strong>$12.500</strong></div>
        <p>Historial: 6 compras registradas en Perfumeria Aurora.</p>
      </div>
    </section>
  )
}

export function PurchasePanel() {
  return (
    <section className="product-panel purchase-panel-real" aria-label="Compras Vexor con proveedor, documento y actualizacion de stock">
      <div className="panel-head compact-head">
        <div>
          <span>Compras</span>
          <strong>BellezaPro SpA</strong>
        </div>
        <span className="soft-pill">Stock actualizado</span>
      </div>
      <div className="purchase-lines-real">
        <div><span>Documento interno</span><strong>CP-0048</strong></div>
        <div><span>Productos recibidos</span><strong>24 unidades</strong></div>
        <div><span>Categorias</span><strong>Rostro · Capilar</strong></div>
      </div>
    </section>
  )
}

export function ConnectedFlowPanel() {
  const steps = ['Venta', 'Stock', 'Cliente', 'Caja', 'Historial', 'Reportes']

  return (
    <div className="connected-flow-real" aria-label="Flujo conectado de Vexor desde venta hasta reportes">
      {steps.map((step, index) => (
        <div key={step}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{step}</strong>
        </div>
      ))}
    </div>
  )
}
