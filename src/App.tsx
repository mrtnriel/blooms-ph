import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  occasions: string[];
  stock: number;
  sameDay: boolean;
  badge?: string;
};

type CartItem = { product: Product; size: string; quantity: number; addon?: string };
type Order = {
  ref: string;
  customer: string;
  recipient: string;
  date: string;
  slot: string;
  total: number;
  status: string;
  items: CartItem[];
};

const photos = [
  "https://images.unsplash.com/photo-1540635352372-c21b523a29c6?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1624471789722-0096b9c7d275?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1539346254710-b6d86e095035?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1489489794016-02d3319076ba?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1615208430631-a9a3a3d3c4bf?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1588097936682-771216f6e22a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1679502460588-059242fac3d8?auto=format&fit=crop&w=900&q=85",
];

const seedProducts: Product[] = [
  {
    id: 1,
    name: "Amara Rose Garden",
    description: "Blush roses, lisianthus, and eucalyptus in our signature wrap.",
    price: 1490,
    image: photos[2],
    type: "Roses",
    occasions: ["Anniversary", "Birthday"],
    stock: 18,
    sameDay: true,
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Sunday Tulips",
    description: "A joyful armful of fresh seasonal tulips in soft spring hues.",
    price: 1290,
    image: photos[1],
    type: "Tulips",
    occasions: ["Birthday", "Get Well"],
    stock: 9,
    sameDay: true,
    badge: "New",
  },
  {
    id: 3,
    name: "Celeste",
    description: "An airy medley of roses and garden flowers, hand-tied with silk.",
    price: 1890,
    image: photos[0],
    type: "Mixed Flowers",
    occasions: ["Anniversary", "Graduation"],
    stock: 12,
    sameDay: true,
  },
  {
    id: 4,
    name: "Ivory Morning",
    description: "Cream blooms and greenery for quiet, meaningful moments.",
    price: 1690,
    image: photos[3],
    type: "Mixed Flowers",
    occasions: ["Sympathy", "Get Well"],
    stock: 5,
    sameDay: false,
    badge: "Limited",
  },
  {
    id: 5,
    name: "Scarlet Promise",
    description: "A classic expression of premium red roses and lush foliage.",
    price: 2190,
    image: photos[5],
    type: "Roses",
    occasions: ["Valentine’s", "Anniversary"],
    stock: 7,
    sameDay: true,
  },
  {
    id: 6,
    name: "Tulip Reverie",
    description: "Elegant red and ivory tulips arranged in a modern bouquet.",
    price: 1590,
    image: photos[4],
    type: "Tulips",
    occasions: ["Birthday", "Mother’s Day"],
    stock: 14,
    sameDay: true,
  },
];

const seedOrders: Order[] = [
  {
    ref: "BLM-250428",
    customer: "Mia Santos",
    recipient: "Elena Santos",
    date: "May 18, 2025",
    slot: "Morning",
    total: 1840,
    status: "Arranging",
    items: [],
  },
  {
    ref: "BLM-250427",
    customer: "Paolo Reyes",
    recipient: "Ana Reyes",
    date: "May 18, 2025",
    slot: "Afternoon",
    total: 2590,
    status: "Confirmed",
    items: [],
  },
  {
    ref: "BLM-250426",
    customer: "Camille Cruz",
    recipient: "Lara Cruz",
    date: "May 19, 2025",
    slot: "Evening",
    total: 2190,
    status: "Pending",
    items: [],
  },
  {
    ref: "BLM-250425",
    customer: "Noah Lim",
    recipient: "Bea Lim",
    date: "May 17, 2025",
    slot: "Afternoon",
    total: 1490,
    status: "Out for Delivery",
    items: [],
  },
  {
    ref: "BLM-250424",
    customer: "Andrea Yu",
    recipient: "Sofia Yu",
    date: "May 16, 2025",
    slot: "Morning",
    total: 1890,
    status: "Delivered",
    items: [],
  },
];

const occasions = [
  "Birthday",
  "Anniversary",
  "Valentine’s Day",
  "Mother’s Day",
  "Graduation",
  "Sympathy",
  "Get Well Soon",
];
const peso = (n: number) => `₱${n.toLocaleString()}`;

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l1 13H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    flower: (
      <>
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="6" r="4" />
        <circle cx="18" cy="12" r="4" />
        <circle cx="12" cy="18" r="4" />
        <circle cx="6" cy="12" r="4" />
      </>
    ),
    calendar: (
      <>
        <path d="M5 4h14v17H5zM8 2v4M16 2v4M5 9h14" />
      </>
    ),
    heart: (
      <path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    logout: (
      <>
        <path d="M10 4H4v16h6M14 8l4 4-4 4M18 12H8" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    edit: (
      <>
        <path d="m14 4 6 6L9 21H3v-6z" />
        <path d="m12 6 6 6" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
      </>
    ),
    chat: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  onClick,
  kind = "primary",
  type = "button",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${kind} ${className}`}
    >
      {children}
    </button>
  );
}

function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Header({
  navigate,
  openCart,
  count,
}: {
  navigate: (p: string) => void;
  openCart: () => void;
  count: number;
}) {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <div className="announcement">
        Complimentary delivery in Metro Manila on orders over ₱2,500{" "}
        <span>Shop same-day flowers →</span>
      </div>
      <header className="header">
        <button className="mobile-menu" onClick={() => setMenu(!menu)}>
          <Icon name="menu" />
        </button>
        <button className="brand" onClick={() => navigate("home")}>
          <Icon name="flower" size={25} />
          <span>
            Blooms <i>PH</i>
          </span>
        </button>
        <nav className={menu ? "nav open" : "nav"}>
          {["Home", "Shop", "Occasions", "Same-Day Delivery", "About Us"].map((x) => (
            <button
              key={x}
              onClick={() => {
                navigate(x === "Shop" || x === "Occasions" ? "shop" : "home");
                setMenu(false);
              }}
            >
              {x}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button aria-label="Search" onClick={() => navigate("shop")}>
            <Icon name="search" />
          </button>
          <button aria-label="Account" onClick={() => navigate("account")}>
            <Icon name="user" />
          </button>
          <button aria-label="Cart" className="cart-icon" onClick={openCart}>
            <Icon name="bag" />
            {count > 0 && <span>{count}</span>}
          </button>
        </div>
      </header>
    </>
  );
}

function ProductCard({
  product,
  onQuick,
  onAdd,
}: {
  product: Product;
  onQuick: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.badge && (
          <Badge tone={product.badge === "Limited" ? "rose" : "cream"}>{product.badge}</Badge>
        )}
        <button className="heart" aria-label="Save product">
          <Icon name="heart" size={18} />
        </button>
        <button className="quick" onClick={onQuick}>
          Quick view
        </button>
      </div>
      <div className="product-info">
        <div className="meta">
          {product.type} · {product.sameDay ? "Same-day" : "Pre-order"}
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>From {peso(product.price)}</strong>
          <button onClick={onAdd} aria-label={`Add ${product.name} to cart`}>
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Home({
  products,
  navigate,
  quick,
  add,
}: {
  products: Product[];
  navigate: (p: string) => void;
  quick: (p: Product) => void;
  add: (p: Product) => void;
}) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Thoughtfully arranged, beautifully delivered</span>
          <h1>
            Make every
            <br />
            <em>moment bloom.</em>
          </h1>
          <p>
            Artful flowers for life's big celebrations and little gestures, delivered across Metro
            Manila today or whenever the moment feels right.
          </p>
          <div className="hero-buttons">
            <Button onClick={() => navigate("shop")}>
              Shop flowers <span>→</span>
            </Button>
            <Button kind="link" onClick={() => navigate("shop")}>
              Explore occasions
            </Button>
          </div>
          <div className="hero-note">
            <span>
              <Icon name="truck" size={18} /> Same-day delivery
            </span>
            <span>
              <Icon name="flower" size={18} /> Hand-arranged locally
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <img src={photos[0]} alt="Woman holding an elegant pink floral bouquet" />
          <div className="hero-float">
            <span>Today’s favorite</span>
            <strong>Celeste</strong>
            <small>Soft, garden-inspired elegance</small>
          </div>
        </div>
      </section>

      <section className="section occasions">
        <div className="section-head">
          <div>
            <span className="eyebrow">Flowers for every story</span>
            <h2>What are we celebrating?</h2>
          </div>
          <button onClick={() => navigate("shop")}>
            View all occasions <span>→</span>
          </button>
        </div>
        <div className="occasion-row">
          {occasions.map((x, i) => (
            <button key={x} onClick={() => navigate("shop")} className="occasion-card">
              <div>
                <img src={photos[(i + 1) % photos.length]} alt="" />
                <span>{x}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section products-section">
        <div className="center-head">
          <span className="eyebrow">Loved, sent, remembered</span>
          <h2>Fresh favorites</h2>
          <p>Our most-loved arrangements, designed by hand with the season’s finest blooms.</p>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} onQuick={() => quick(p)} onAdd={() => add(p)} />
          ))}
        </div>
        <div className="center-action">
          <Button kind="outline" onClick={() => navigate("shop")}>
            View the full collection
          </Button>
        </div>
      </section>

      <section className="same-day">
        <div className="same-image">
          <img src={photos[6]} alt="Fresh bouquet in a vase" />
        </div>
        <div className="same-copy">
          <span className="eyebrow">A beautiful save for today</span>
          <h2>
            Last-minute doesn’t
            <br />
            have to feel like it.
          </h2>
          <p>
            Order by 1:00 PM for thoughtfully arranged flowers delivered across Metro Manila the
            very same day.
          </p>
          <ul>
            <li>
              <Icon name="check" size={17} /> Handcrafted by our in-house florists
            </li>
            <li>
              <Icon name="check" size={17} /> Live delivery updates from studio to doorstep
            </li>
            <li>
              <Icon name="check" size={17} /> A complimentary handwritten card
            </li>
          </ul>
          <Button onClick={() => navigate("shop")}>Shop same-day flowers</Button>
        </div>
      </section>

      <section className="section how">
        <div className="center-head">
          <span className="eyebrow">From heart to doorstep</span>
          <h2>Sending flowers, made simple</h2>
        </div>
        <div className="steps">
          {[
            [
              "01",
              "Choose their blooms",
              "Explore arrangements for every personality and occasion.",
            ],
            ["02", "Make it personal", "Pick a size, add a gift, and write your message."],
            ["03", "Choose the moment", "Select a delivery date and time that works for them."],
          ].map((s) => (
            <div className="step" key={s[0]}>
              <span>{s[0]}</span>
              <h3>{s[1]}</h3>
              <p>{s[2]}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="testimonial">
        <Icon name="flower" size={28} />
        <blockquote>
          “The bouquet looked even lovelier in person. It arrived exactly when promised, and my mom
          couldn’t stop smiling.”
        </blockquote>
        <p>— Bianca M., Quezon City</p>
      </section>
      <Newsletter />
    </main>
  );
}

function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="newsletter">
      <div>
        <span className="eyebrow">A little beauty in your inbox</span>
        <h2>Fresh flowers, thoughtful reminders.</h2>
        <p>Seasonal stories, occasion reminders, and ₱200 off your first order.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <input required type="email" placeholder="Your email address" />
        <Button type="submit">{done ? "You’re on the list" : "Join the list"}</Button>
      </form>
    </section>
  );
}

function Shop({
  products,
  quick,
  add,
}: {
  products: Product[];
  quick: (p: Product) => void;
  add: (p: Product) => void;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("Featured");
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (type === "All" || p.type === type) &&
            `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "Price: Low to High"
            ? a.price - b.price
            : sort === "Price: High to Low"
              ? b.price - a.price
              : a.id - b.id,
        ),
    [products, query, type, sort],
  );
  return (
    <main className="shop-page">
      <div className="shop-intro">
        <span className="eyebrow">The flower shop</span>
        <h1>Find the perfect flowers</h1>
        <p>Every arrangement is made by hand, with the freshest blooms we can find.</p>
      </div>
      <div className="catalog">
        <aside className="filters">
          <div className="search-field">
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search flowers..."
            />
          </div>
          <div className="filter-group">
            <strong>Flower type</strong>
            {["All", "Roses", "Tulips", "Mixed Flowers"].map((x) => (
              <label key={x}>
                <input type="radio" checked={type === x} onChange={() => setType(x)} />
                <span>{x}</span>
              </label>
            ))}
          </div>
          <div className="filter-group">
            <strong>Availability</strong>
            <label>
              <input type="checkbox" />
              <span>Same-day available</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>In stock today</span>
            </label>
          </div>
          <div className="filter-group">
            <strong>Price range</strong>
            <input type="range" min="900" max="3000" defaultValue="2600" />
          </div>
          <button
            className="clear"
            onClick={() => {
              setQuery("");
              setType("All");
            }}
          >
            Clear all filters
          </button>
        </aside>
        <section className="catalog-results">
          <div className="catalog-bar">
            <span>{filtered.length} arrangements</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
          <div className="product-grid three">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onQuick={() => quick(p)} onAdd={() => add(p)} />
            ))}
          </div>
          {!filtered.length && (
            <div className="empty">
              <Icon name="flower" size={36} />
              <h3>No flowers found</h3>
              <p>Try a different search or clear your filters.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function QuickView({
  product,
  close,
  add,
}: {
  product: Product;
  close: () => void;
  add: (p: Product, size: string, addon?: string) => void;
}) {
  const [size, setSize] = useState("Standard");
  const [addon, setAddon] = useState("");
  const price = product.price + (size === "Deluxe" ? 500 : size === "Premium" ? 900 : 0);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal quick-modal">
        <button className="modal-close" onClick={close}>
          <Icon name="close" />
        </button>
        <img src={product.image} alt={product.name} />
        <div className="modal-copy">
          <span className="eyebrow">
            {product.type} · {product.sameDay ? "Same-day available" : "Pre-order"}
          </span>
          <h2>{product.name}</h2>
          <p>
            {product.description} Wrapped in our signature paper and finished with a keepsake
            ribbon.
          </p>
          <strong className="modal-price">{peso(price)}</strong>
          <label className="field-label">Choose your size</label>
          <div className="choice-row">
            {["Standard", "Deluxe", "Premium"].map((s, i) => (
              <button className={size === s ? "active" : ""} onClick={() => setSize(s)} key={s}>
                <b>{s}</b>
                <small>{i ? `+${peso(i === 1 ? 500 : 900)}` : "As shown"}</small>
              </button>
            ))}
          </div>
          <label className="field-label">Add a little more</label>
          <select value={addon} onChange={(e) => setAddon(e.target.value)}>
            <option value="">No add-on</option>
            <option>Artisan chocolates (+₱450)</option>
            <option>Celebration balloon (+₱250)</option>
            <option>Mini plush toy (+₱350)</option>
          </select>
          <Button onClick={() => add(product, size, addon)}>Add to bag · {peso(price)}</Button>
          <small className="availability">
            <Icon name="check" size={14} /> In stock and ready to arrange
          </small>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  items,
  close,
  update,
  remove,
  checkout,
}: {
  items: CartItem[];
  close: () => void;
  update: (i: number, n: number) => void;
  remove: (i: number) => void;
  checkout: () => void;
}) {
  const subtotal = items.reduce(
    (s, x) =>
      s +
      (x.product.price + (x.size === "Deluxe" ? 500 : x.size === "Premium" ? 900 : 0)) * x.quantity,
    0,
  );
  return (
    <div
      className="overlay drawer-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <aside className="cart-drawer">
        <div className="drawer-head">
          <div>
            <span className="eyebrow">Your selection</span>
            <h2>
              Shopping bag <small>{items.length}</small>
            </h2>
          </div>
          <button onClick={close}>
            <Icon name="close" />
          </button>
        </div>
        {!items.length ? (
          <div className="empty cart-empty">
            <Icon name="bag" size={42} />
            <h3>Your bag is waiting to bloom</h3>
            <p>Discover something beautiful for someone special.</p>
            <Button onClick={close}>Continue shopping</Button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((x, i) => (
                <div className="cart-item" key={`${x.product.id}-${i}`}>
                  <img src={x.product.image} />
                  <div>
                    <h3>{x.product.name}</h3>
                    <p>
                      {x.size}
                      {x.addon && ` · ${x.addon}`}
                    </p>
                    <strong>
                      {peso(
                        x.product.price +
                          (x.size === "Deluxe" ? 500 : x.size === "Premium" ? 900 : 0),
                      )}
                    </strong>
                    <div className="qty">
                      <button onClick={() => update(i, x.quantity - 1)}>
                        <Icon name="minus" size={14} />
                      </button>
                      <span>{x.quantity}</span>
                      <button onClick={() => update(i, x.quantity + 1)}>
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                  </div>
                  <button className="remove" onClick={() => remove(i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{peso(subtotal)}</strong>
              </div>
              <p>Delivery fee calculated at checkout.</p>
              <Button onClick={checkout}>
                Proceed to checkout <span>→</span>
              </Button>
              <button onClick={close}>Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Checkout({
  cart,
  place,
  navigate,
}: {
  cart: CartItem[];
  place: (recipient: string, date: string, slot: string) => void;
  navigate: (p: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(18);
  const [slot, setSlot] = useState("Morning");
  const [message, setMessage] = useState("");
  const [promo, setPromo] = useState("");
  const [validPromo, setValidPromo] = useState(false);
  const [error, setError] = useState("");
  const subtotal = cart.reduce(
    (s, x) =>
      s +
      (x.product.price + (x.size === "Deluxe" ? 500 : x.size === "Premium" ? 900 : 0)) * x.quantity,
    0,
  );
  if (!cart.length)
    return (
      <main className="empty-page">
        <div className="empty">
          <Icon name="bag" size={44} />
          <h2>Your bag is empty</h2>
          <Button onClick={() => navigate("shop")}>Browse flowers</Button>
        </div>
      </main>
    );
  const next = () => {
    if (step === 1 && (!recipient || !address)) {
      setError("Please complete the recipient and delivery address.");
      return;
    }
    setError("");
    setStep(Math.min(5, step + 1));
  };
  return (
    <main className="checkout-page">
      <div className="checkout-top">
        <button className="brand" onClick={() => navigate("home")}>
          <Icon name="flower" size={25} />
          <span>
            Blooms <i>PH</i>
          </span>
        </button>
        <span>Secure checkout</span>
      </div>
      <div className="progress">
        {["Delivery", "Schedule", "Personalize", "Payment", "Review"].map((x, i) => (
          <div className={step >= i + 1 ? "active" : ""} key={x}>
            <span>{step > i + 1 ? <Icon name="check" size={13} /> : i + 1}</span>
            <small>{x}</small>
          </div>
        ))}
      </div>
      <div className="checkout-grid">
        <section className="checkout-form">
          {step === 1 && (
            <>
              <span className="eyebrow">Step 1 of 5</span>
              <h1>Where should we deliver?</h1>
              <p className="lead">Tell us a little about the lucky recipient.</p>
              <div className="saved-address">
                <Icon name="user" />
                <div>
                  <b>Deliver to myself</b>
                  <small>Mia Santos · Home</small>
                </div>
                <button
                  onClick={() => {
                    setRecipient("Mia Santos");
                    setAddress("18 Sampaguita St., Makati City");
                  }}
                >
                  Use
                </button>
              </div>
              <div className="form-grid">
                <label>
                  Recipient’s full name
                  <input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Full name"
                  />
                </label>
                <label>
                  Contact number
                  <input placeholder="+63 9XX XXX XXXX" />
                </label>
                <label className="wide">
                  Delivery address
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/unit, street, barangay"
                  />
                </label>
                <label>
                  City
                  <select>
                    <option>Makati City</option>
                    <option>Quezon City</option>
                    <option>Taguig City</option>
                  </select>
                </label>
                <label>
                  Delivery instructions
                  <input placeholder="Landmark, gate code, etc." />
                </label>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <span className="eyebrow">Step 2 of 5</span>
              <h1>Choose their moment</h1>
              <p className="lead">
                Same-day orders close at 1:00 PM. Select an available date and window.
              </p>
              <div className="calendar-head">
                <button>‹</button>
                <b>May 2025</b>
                <button>›</button>
              </div>
              <div className="mini-calendar">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <b key={i}>{d}</b>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <button
                    disabled={[4, 11, 25].includes(d)}
                    className={`${date === d ? "selected " : ""}${[14, 20].includes(d) ? "peak " : ""}`}
                    onClick={() => setDate(d)}
                    key={d}
                  >
                    {d}
                    {[14, 20].includes(d) && <i />}
                  </button>
                ))}
              </div>
              <div className="legend">
                <span>
                  <i className="available" />
                  Available
                </span>
                <span>
                  <i className="peak" />
                  Peak date
                </span>
                <span>
                  <i className="blocked" />
                  Unavailable
                </span>
              </div>
              <h3>Delivery window</h3>
              <div className="slots">
                {[
                  ["Morning", "9 AM – 12 PM", "8 of 15 left"],
                  ["Afternoon", "12 PM – 4 PM", "Almost full"],
                  ["Evening", "4 PM – 8 PM", "5 of 10 left"],
                ].map((s) => (
                  <button
                    className={slot === s[0] ? "active" : ""}
                    onClick={() => setSlot(s[0])}
                    key={s[0]}
                  >
                    <b>{s[0]}</b>
                    <span>{s[1]}</span>
                    <small>{s[2]}</small>
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <span className="eyebrow">Step 3 of 5</span>
              <h1>Make it personal</h1>
              <p className="lead">Add a note that we’ll handwrite on a complimentary card.</p>
              <label>
                Card message
                <textarea
                  maxLength={180}
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something from the heart..."
                />
                <small className="counter">{message.length}/180</small>
              </label>
              <h3>Something extra?</h3>
              <div className="addon-grid">
                {[
                  "Artisan chocolates · ₱450",
                  "Celebration balloon · ₱250",
                  "Mini plush toy · ₱350",
                ].map((x) => (
                  <label key={x}>
                    <input type="checkbox" />
                    <span>{x}</span>
                  </label>
                ))}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <span className="eyebrow">Step 4 of 5</span>
              <h1>How would you like to pay?</h1>
              <p className="lead">No payment will be processed in this prototype.</p>
              <div className="payment-cards">
                <label>
                  <input type="radio" name="pay" defaultChecked />
                  <span>
                    <b>Cash on Delivery</b>
                    <small>Pay upon successful delivery</small>
                  </span>
                </label>
                <label>
                  <input type="radio" name="pay" />
                  <span>
                    <b>Sandbox / Test Payment</b>
                    <small>Simulated card payment</small>
                  </span>
                </label>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <span className="eyebrow">Final step</span>
              <h1>Everything look lovely?</h1>
              <p className="lead">Review the details before placing your order.</p>
              <div className="review-box">
                <div>
                  <b>Recipient</b>
                  <span>{recipient}</span>
                  <span>{address}</span>
                </div>
                <button onClick={() => setStep(1)}>Edit</button>
              </div>
              <div className="review-box">
                <div>
                  <b>Delivery</b>
                  <span>
                    May {date}, 2025 · {slot}
                  </span>
                </div>
                <button onClick={() => setStep(2)}>Edit</button>
              </div>
              <label>
                Promo code
                <div className="promo">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Try BLOOM200"
                  />
                  <Button
                    kind="outline"
                    onClick={() => setValidPromo(promo.toUpperCase() === "BLOOM200")}
                  >
                    Apply
                  </Button>
                </div>
                {validPromo && <small className="success">Promo applied — you saved ₱200.</small>}
              </label>
            </>
          )}
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            {step > 1 && (
              <Button kind="link" onClick={() => setStep(step - 1)}>
                ← Back
              </Button>
            )}
            <Button
              onClick={() => (step === 5 ? place(recipient, `May ${date}, 2025`, slot) : next())}
            >
              {step === 5 ? "Place order" : "Continue"} <span>→</span>
            </Button>
          </div>
        </section>
        <aside className="order-summary">
          <h2>Your order</h2>
          {cart.map((x, i) => (
            <div className="summary-item" key={i}>
              <img src={x.product.image} />
              <div>
                <b>{x.product.name}</b>
                <small>
                  {x.size} · Qty {x.quantity}
                </small>
              </div>
              <strong>{peso(x.product.price * x.quantity)}</strong>
            </div>
          ))}
          <div className="summary-totals">
            <div>
              <span>Subtotal</span>
              <span>{peso(subtotal)}</span>
            </div>
            <div>
              <span>Delivery</span>
              <span>₱250</span>
            </div>
            {validPromo && (
              <div className="discount">
                <span>Promo</span>
                <span>−₱200</span>
              </div>
            )}
            <div className="total">
              <b>Total</b>
              <b>{peso(subtotal + 250 - (validPromo ? 200 : 0))}</b>
            </div>
          </div>
          <p>
            <Icon name="check" size={14} /> Freshness guaranteed on every delivery
          </p>
        </aside>
      </div>
    </main>
  );
}

function Confirmation({ order, navigate }: { order: Order; navigate: (p: string) => void }) {
  return (
    <main className="confirmation">
      <div className="success-mark">
        <Icon name="check" size={32} />
      </div>
      <span className="eyebrow">Order confirmed</span>
      <h1>We’ll make it beautiful.</h1>
      <p>Thank you, {order.customer.split(" ")[0]}. Your flowers are officially in our care.</p>
      <div className="confirmation-card">
        <div>
          <span>Order reference</span>
          <strong>{order.ref}</strong>
        </div>
        <hr />
        <div className="confirmation-details">
          <span>
            <Icon name="calendar" />
            <small>Delivery date</small>
            <b>{order.date}</b>
          </span>
          <span>
            <Icon name="truck" />
            <small>Delivery window</small>
            <b>{order.slot}</b>
          </span>
          <span>
            <Icon name="user" />
            <small>Recipient</small>
            <b>{order.recipient}</b>
          </span>
        </div>
      </div>
      <div className="hero-buttons">
        <Button onClick={() => navigate("tracking")}>Track your order</Button>
        <Button kind="outline" onClick={() => navigate("shop")}>
          Keep shopping
        </Button>
      </div>
    </main>
  );
}

function Account({
  orders,
  navigate,
  reorder,
}: {
  orders: Order[];
  navigate: (p: string) => void;
  reorder: (o: Order) => void;
}) {
  return (
    <main className="account-page">
      <aside className="account-nav">
        <div className="avatar">MS</div>
        <h3>Mia Santos</h3>
        <p>mia.santos@email.com</p>
        {["Overview", "My orders", "Saved addresses", "Occasion reminders", "Account settings"].map(
          (x, i) => (
            <button className={i === 0 ? "active" : ""} key={x}>
              {x}
              <Icon name="arrow" size={15} />
            </button>
          ),
        )}
      </aside>
      <section className="account-main">
        <span className="eyebrow">My account</span>
        <h1>Good morning, Mia.</h1>
        <p className="lead">Here’s what’s blooming in your world.</p>
        <div className="upcoming">
          <div>
            <Icon name="calendar" size={28} />
            <span>
              <small>Coming up in 12 days</small>
              <b>Mom’s birthday</b>
              <p>May 29 · Occasion reminder</p>
            </span>
          </div>
          <Button kind="outline" onClick={() => navigate("shop")}>
            Find a gift
          </Button>
        </div>
        <div className="account-section-head">
          <h2>Recent orders</h2>
          <button onClick={() => navigate("tracking")}>View order tracking →</button>
        </div>
        <div className="orders-list">
          {orders.slice(0, 3).map((o) => (
            <div className="order-row" key={o.ref}>
              <div>
                <small>ORDER</small>
                <b>{o.ref}</b>
              </div>
              <div>
                <small>DELIVERY</small>
                <b>{o.date}</b>
              </div>
              <div>
                <small>TOTAL</small>
                <b>{peso(o.total)}</b>
              </div>
              <Badge tone={o.status === "Delivered" ? "green" : "cream"}>{o.status}</Badge>
              <button onClick={() => reorder(o)}>Reorder</button>
            </div>
          ))}
        </div>
        <div className="account-two">
          <div>
            <span className="eyebrow">Saved address</span>
            <h3>Home</h3>
            <p>
              18 Sampaguita St., San Lorenzo
              <br />
              Makati City, Metro Manila
            </p>
            <button>Edit address →</button>
          </div>
          <div>
            <span className="eyebrow">Blooms & benefits</span>
            <h3>3 bouquets away</h3>
            <p>Send three more arrangements to unlock complimentary delivery.</p>
            <div className="mini-progress">
              <i />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Tracking({ order }: { order: Order }) {
  const stages = ["Pending", "Confirmed", "Arranging", "Out for Delivery", "Delivered"];
  const at = Math.max(0, stages.indexOf(order.status));
  return (
    <main className="tracking">
      <span className="eyebrow">Order tracking</span>
      <h1>Your flowers are in good hands.</h1>
      <p>
        Order <b>{order.ref}</b> · Placed May 15, 2025
      </p>
      <div className="tracking-card">
        <div className="tracking-head">
          <div>
            <small>Expected delivery</small>
            <h2>{order.date}</h2>
            <p>
              {order.slot} · To {order.recipient}
            </p>
          </div>
          <Badge>{order.status}</Badge>
        </div>
        <div className="timeline">
          {stages.map((s, i) => (
            <div className={i <= at ? "done" : ""} key={s}>
              <span>{i < at ? <Icon name="check" size={13} /> : i + 1}</span>
              <b>{s}</b>
              <small>
                {
                  [
                    "Order received",
                    "Details verified",
                    "Being handcrafted",
                    "On the way",
                    "At their doorstep",
                  ][i]
                }
              </small>
            </div>
          ))}
        </div>
        <div className="tracking-note">
          <Icon name="flower" />
          <p>
            <b>Currently arranging your bouquet</b>
            <br />
            Our florist is hand-selecting each stem and bringing your arrangement to life.
          </p>
        </div>
      </div>
      <div className="delivery-summary">
        <div>
          <h3>Delivery details</h3>
          <p>
            {order.recipient}
            <br />
            18 Sampaguita St., Makati City
            <br />
            +63 917 555 0182
          </p>
        </div>
        <div>
          <h3>Payment</h3>
          <p>
            Cash on Delivery
            <br />
            <b>{peso(order.total)}</b>
          </p>
        </div>
      </div>
    </main>
  );
}

const adminLinks = [
  "Dashboard",
  "Orders",
  "Delivery Calendar",
  "Products",
  "Categories & Occasions",
  "Inventory",
  "Delivery Slots",
  "Blocked & Peak Dates",
  "Promo Codes",
  "Customers",
  "Settings",
];

function Admin({
  products,
  setProducts,
  orders,
  setOrders,
  navigate,
  toast,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  navigate: (p: string) => void;
  toast: (s: string) => void;
}) {
  const [tab, setTab] = useState("Dashboard");
  const [editing, setEditing] = useState<Product | null>(null);
  const [calendarDay, setCalendarDay] = useState(18);
  const statusTone = (s: string) =>
    s === "Delivered" ? "green" : s === "Pending" ? "rose" : "cream";
  const updateStatus = (ref: string, status: string) => {
    setOrders((os) => os.map((o) => (o.ref === ref ? { ...o, status } : o)));
    toast(`Order ${ref} updated to ${status}`);
  };
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <button className="admin-brand" onClick={() => navigate("home")}>
          <Icon name="flower" size={27} />
          <span>
            Blooms PH<small>Florist console</small>
          </span>
        </button>
        <nav>
          {adminLinks.map((x) => (
            <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>
              <span>{x[0]}</span>
              {x}
            </button>
          ))}
        </nav>
        <div className="admin-user">
          <div>AR</div>
          <span>
            <b>Amelia Reyes</b>
            <small>Administrator</small>
          </span>
          <button onClick={() => navigate("home")}>
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
      <section className="admin-main">
        <header className="admin-header">
          <div>
            <button className="mobile-menu">
              <Icon name="menu" />
            </button>
            <span>{tab}</span>
          </div>
          <div>
            <button>
              <Icon name="search" />
            </button>
            <button>
              <Icon name="bell" />
            </button>
            <span>Saturday, May 17</span>
          </div>
        </header>
        {tab === "Dashboard" && (
          <div className="admin-content">
            <div className="admin-title">
              <div>
                <span className="eyebrow">Saturday, May 17</span>
                <h1>Good morning, Amelia.</h1>
                <p>Here’s what needs your attention at the studio today.</p>
              </div>
              <Button onClick={() => setTab("Orders")}>View today’s orders</Button>
            </div>
            <div className="stats">
              {[
                ["Total sales", "₱48,290", "+12.5%"],
                ["Total orders", "28", "+8.2%"],
                ["Pending orders", "6", "Needs attention"],
                ["Upcoming deliveries", "17", "Today"],
                ["Cancelled", "2", "−1.4%"],
              ].map((x, i) => (
                <div key={x[0]}>
                  <small>{x[0]}</small>
                  <strong>{x[1]}</strong>
                  <span className={i === 2 ? "warn" : ""}>{x[2]}</span>
                </div>
              ))}
            </div>
            <div className="analytics-grid">
              <div className="chart-card">
                <div className="card-head">
                  <div>
                    <h3>Sales overview</h3>
                    <p>May 11–17, 2025</p>
                  </div>
                  <select>
                    <option>This week</option>
                    <option>This month</option>
                  </select>
                </div>
                <div className="bar-chart">
                  {[42, 67, 50, 82, 71, 94, 76].map((h, i) => (
                    <div key={i}>
                      <span style={{ height: `${h}%` }} />
                      <small>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="capacity-card">
                <div className="card-head">
                  <div>
                    <h3>Today’s capacity</h3>
                    <p>17 of 37 slots filled</p>
                  </div>
                  <button onClick={() => setTab("Delivery Slots")}>Manage</button>
                </div>
                {[
                  ["Morning", 8, 15],
                  ["Afternoon", 12, 12],
                  ["Evening", 5, 10],
                ].map((x) => (
                  <div className="capacity" key={x[0] as string}>
                    <div>
                      <b>{x[0]}</b>
                      <span>
                        {x[1]} / {x[2]}
                      </span>
                    </div>
                    <div>
                      <i style={{ width: `${(Number(x[1]) / Number(x[2])) * 100}%` }} />
                    </div>
                    <small className={x[1] === x[2] ? "full" : ""}>
                      {x[1] === x[2]
                        ? "Fully booked"
                        : Number(x[1]) / Number(x[2]) > 0.7
                          ? "Almost full"
                          : "Available"}
                    </small>
                  </div>
                ))}
              </div>
            </div>
            <div className="table-card">
              <div className="card-head">
                <div>
                  <h3>Recent orders</h3>
                  <p>Latest activity across your store</p>
                </div>
                <button onClick={() => setTab("Orders")}>View all orders →</button>
              </div>
              <OrderTable orders={orders} updateStatus={updateStatus} />
            </div>
          </div>
        )}
        {tab === "Orders" && (
          <div className="admin-content">
            <div className="admin-title">
              <div>
                <span className="eyebrow">Order management</span>
                <h1>Orders</h1>
                <p>Track, update, and prepare every beautiful delivery.</p>
              </div>
              <Button kind="outline" onClick={() => window.print()}>
                Print delivery slip
              </Button>
            </div>
            <div className="admin-filters">
              <div className="search-field">
                <Icon name="search" size={17} />
                <input placeholder="Search order or customer" />
              </div>
              <select>
                <option>All statuses</option>
                <option>Pending</option>
                <option>Confirmed</option>
              </select>
              <input type="date" />
              <select>
                <option>All time slots</option>
                <option>Morning</option>
                <option>Afternoon</option>
              </select>
            </div>
            <div className="table-card">
              <OrderTable orders={orders} updateStatus={updateStatus} />
            </div>
          </div>
        )}
        {tab === "Products" && (
          <div className="admin-content">
            <div className="admin-title">
              <div>
                <span className="eyebrow">Catalog</span>
                <h1>Products</h1>
                <p>{products.length} arrangements in your online flower shop.</p>
              </div>
              <Button
                onClick={() =>
                  setEditing({
                    id: Date.now(),
                    name: "",
                    description: "",
                    price: 1500,
                    image: photos[3],
                    type: "Mixed Flowers",
                    occasions: ["Birthday"],
                    stock: 10,
                    sameDay: true,
                  })
                }
              >
                <Icon name="plus" size={17} /> Add product
              </Button>
            </div>
            <div className="admin-filters">
              <div className="search-field">
                <Icon name="search" size={17} />
                <input placeholder="Search products" />
              </div>
              <select>
                <option>All categories</option>
                <option>Roses</option>
                <option>Tulips</option>
              </select>
              <select>
                <option>All stock levels</option>
                <option>Low stock</option>
              </select>
            </div>
            <div className="product-admin-grid">
              {products.map((p) => (
                <div className="admin-product" key={p.id}>
                  <img src={p.image} />
                  <div>
                    <Badge tone={p.stock < 7 ? "rose" : "green"}>
                      {p.stock < 7 ? "Low stock" : "In stock"}
                    </Badge>
                    <h3>{p.name}</h3>
                    <p>
                      {p.type} · {p.stock} stems available
                    </p>
                    <strong>{peso(p.price)}</strong>
                  </div>
                  <div>
                    <button onClick={() => setEditing(p)}>
                      <Icon name="edit" size={17} />
                    </button>
                    <button
                      onClick={() => {
                        setProducts((ps) => ps.filter((x) => x.id !== p.id));
                        toast("Product removed from catalog");
                      }}
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "Delivery Calendar" && (
          <div className="admin-content">
            <div className="admin-title">
              <div>
                <span className="eyebrow">Delivery operations</span>
                <h1>May 2025</h1>
                <p>Select a day to inspect scheduled deliveries.</p>
              </div>
              <div className="view-toggle">
                <button className="active">Month</button>
                <button>Week</button>
                <button>Day</button>
              </div>
            </div>
            <div className="admin-calendar">
              <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((x) => (
                  <b key={x}>{x}</b>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <button
                    key={d}
                    onClick={() => setCalendarDay(d)}
                    className={`${d === calendarDay ? "selected " : ""}${[14, 20].includes(d) ? "peak " : ""}${[4, 11, 25].includes(d) ? "blocked" : ""}`}
                  >
                    <span>{d}</span>
                    {[16, 17, 18, 19, 22].includes(d) && (
                      <>
                        <i>3 deliveries</i>
                        <small>Morning · 2</small>
                      </>
                    )}
                  </button>
                ))}
              </div>
              <aside>
                <span className="eyebrow">Selected day</span>
                <h2>May {calendarDay}</h2>
                <p>3 scheduled deliveries</p>
                {orders.slice(0, 3).map((o) => (
                  <div className="calendar-order" key={o.ref}>
                    <b>{o.slot}</b>
                    <span>
                      {o.ref}
                      <small>{o.recipient}</small>
                    </span>
                    <Badge tone={statusTone(o.status)}>{o.status}</Badge>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        )}
        {tab === "Delivery Slots" && <Capacity toast={toast} />}
        {tab === "Customers" && (
          <div className="admin-content">
            <div className="admin-title">
              <div>
                <span className="eyebrow">Relationships</span>
                <h1>Customers</h1>
                <p>Know your customers and their gifting history.</p>
              </div>
            </div>
            <div className="table-card customer-table">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Joined</th>
                    <th>Orders</th>
                    <th>Total purchases</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Mia Santos", "mia.santos@email.com", "Jan 18, 2024", "8", "₱14,820"],
                    ["Paolo Reyes", "paolo.r@email.com", "Feb 02, 2024", "5", "₱9,450"],
                    ["Camille Cruz", "camille.c@email.com", "Mar 26, 2024", "11", "₱22,140"],
                    ["Noah Lim", "noah.lim@email.com", "Nov 12, 2024", "3", "₱5,270"],
                  ].map((x) => (
                    <tr key={x[0]}>
                      <td>
                        <b>{x[0]}</b>
                      </td>
                      <td>{x[1]}</td>
                      <td>{x[2]}</td>
                      <td>{x[3]}</td>
                      <td>
                        <b>{x[4]}</b>
                      </td>
                      <td>
                        <button>View profile →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {![
          "Dashboard",
          "Orders",
          "Products",
          "Delivery Calendar",
          "Delivery Slots",
          "Customers",
        ].includes(tab) && <GenericAdmin tab={tab} toast={toast} />}
      </section>
      {editing && (
        <ProductEditor
          product={editing}
          close={() => setEditing(null)}
          save={(p) => {
            setProducts((ps) =>
              ps.some((x) => x.id === p.id) ? ps.map((x) => (x.id === p.id ? p : x)) : [p, ...ps],
            );
            setEditing(null);
            toast("Product saved and storefront updated");
          }}
        />
      )}
    </div>
  );
}

function OrderTable({
  orders,
  updateStatus,
}: {
  orders: Order[];
  updateStatus: (r: string, s: string) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer / Recipient</th>
            <th>Delivery</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.ref}>
              <td>
                <b>{o.ref}</b>
              </td>
              <td>
                <b>{o.customer}</b>
                <small>For {o.recipient}</small>
              </td>
              <td>
                <b>{o.date}</b>
                <small>{o.slot}</small>
              </td>
              <td>
                <b>{peso(o.total)}</b>
              </td>
              <td>
                <select
                  className={`status status-${o.status.toLowerCase().replaceAll(" ", "-")}`}
                  value={o.status}
                  onChange={(e) => updateStatus(o.ref, e.target.value)}
                >
                  {["Pending", "Confirmed", "Arranging", "Out for Delivery", "Delivered"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </td>
              <td>
                <button>•••</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Capacity({ toast }: { toast: (s: string) => void }) {
  const [caps, setCaps] = useState([15, 12, 10]);
  return (
    <div className="admin-content">
      <div className="admin-title">
        <div>
          <span className="eyebrow">Scheduling controls</span>
          <h1>Delivery slots</h1>
          <p>Manage daily capacity and customer availability.</p>
        </div>
        <Button onClick={() => toast("Delivery capacity saved and checkout updated")}>
          Save changes
        </Button>
      </div>
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Daily slot capacity</h3>
          <p>Set the maximum orders your team can fulfill.</p>
          {["Morning · 9 AM–12 PM", "Afternoon · 12–4 PM", "Evening · 4–8 PM"].map((x, i) => (
            <label key={x}>
              <span>
                {x}
                <small>{[8, 12, 5][i]} orders booked</small>
              </span>
              <input
                type="number"
                value={caps[i]}
                onChange={(e) => setCaps((c) => c.map((v, j) => (j === i ? +e.target.value : v)))}
              />
            </label>
          ))}
        </div>
        <div className="settings-card">
          <h3>Same-day delivery</h3>
          <p>Orders after cutoff move to the next eligible day.</p>
          <label>
            <span>Order cutoff</span>
            <input type="time" defaultValue="13:00" />
          </label>
          <label>
            <span>Minimum lead time (days)</span>
            <input type="number" defaultValue="0" />
          </label>
        </div>
        <div className="settings-card wide">
          <h3>Blocked & peak dates</h3>
          <p>Control exceptional scheduling rules.</p>
          <div className="date-pills">
            <span>
              May 20 · Peak <button>×</button>
            </span>
            <span>
              May 25 · Blocked <button>×</button>
            </span>
            <span>
              June 12 · Peak <button>×</button>
            </span>
            <button>+ Add date</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericAdmin({ tab, toast }: { tab: string; toast: (s: string) => void }) {
  return (
    <div className="admin-content">
      <div className="admin-title">
        <div>
          <span className="eyebrow">Store management</span>
          <h1>{tab}</h1>
          <p>Manage your florist operations and storefront settings.</p>
        </div>
        <Button onClick={() => toast(`${tab} changes saved`)}>Save changes</Button>
      </div>
      <div className="generic-grid">
        {["Active", "Scheduled", "Needs attention"].map((x, i) => (
          <div className="generic-card" key={x}>
            <Badge tone={i === 2 ? "rose" : "green"}>{x}</Badge>
            <h3>
              {tab} {i + 1}
            </h3>
            <p>Configure details, visibility, usage rules, and customer-facing availability.</p>
            <div>
              <Button kind="outline">Edit</Button>
              <button className="danger">Delete</button>
            </div>
          </div>
        ))}
        <button className="add-generic">
          <Icon name="plus" size={25} />
          <b>Add new</b>
          <span>Create a new {tab.toLowerCase()} entry</span>
        </button>
      </div>
    </div>
  );
}

function ProductEditor({
  product,
  close,
  save,
}: {
  product: Product;
  close: () => void;
  save: (p: Product) => void;
}) {
  const [p, setP] = useState(product);
  return (
    <div className="overlay">
      <div className="modal editor">
        <div className="drawer-head">
          <div>
            <span className="eyebrow">Catalog editor</span>
            <h2>{product.name ? "Edit product" : "Add product"}</h2>
          </div>
          <button onClick={close}>
            <Icon name="close" />
          </button>
        </div>
        <div className="editor-grid">
          <div className="upload-preview">
            <img src={p.image} />
            <button>Change image</button>
          </div>
          <div className="form-grid">
            <label className="wide">
              Product name
              <input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
            </label>
            <label className="wide">
              Description
              <textarea
                rows={3}
                value={p.description}
                onChange={(e) => setP({ ...p, description: e.target.value })}
              />
            </label>
            <label>
              Flower type
              <select value={p.type} onChange={(e) => setP({ ...p, type: e.target.value })}>
                <option>Roses</option>
                <option>Tulips</option>
                <option>Mixed Flowers</option>
              </select>
            </label>
            <label>
              Standard price
              <input
                type="number"
                value={p.price}
                onChange={(e) => setP({ ...p, price: +e.target.value })}
              />
            </label>
            <label>
              Stock quantity
              <input
                type="number"
                value={p.stock}
                onChange={(e) => setP({ ...p, stock: +e.target.value })}
              />
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={p.sameDay}
                onChange={(e) => setP({ ...p, sameDay: e.target.checked })}
              />{" "}
              Same-day available
            </label>
          </div>
        </div>
        <div className="form-actions">
          <Button kind="link" onClick={close}>
            Cancel
          </Button>
          <Button onClick={() => save(p)}>Save product</Button>
        </div>
      </div>
    </div>
  );
}

function GiftAssistant({ products, add }: { products: Product[]; add: (p: Product) => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, input]);
    setInput("");
  };
  if (!open)
    return (
      <button className="chat-launch" onClick={() => setOpen(true)}>
        <Icon name="chat" />
        <span>Gift assistant</span>
      </button>
    );
  return (
    <aside className="chat-widget">
      <div className="chat-head">
        <div>
          <Icon name="flower" />
          <span>
            <b>Bloom, your gift guide</b>
            <small>Here to help you choose</small>
          </span>
        </div>
        <button onClick={() => setOpen(false)}>
          <Icon name="minus" />
        </button>
      </div>
      <div className="chat-body">
        <div className="bot-message">
          Tell me about the moment, your budget, and when you’d like it delivered. I’ll find
          something lovely.
        </div>
        {messages.map((m, i) => (
          <div key={i}>
            <div className="user-message">{m}</div>
            <div className="bot-message">
              I found two beautiful options under your budget that are available for same-day
              delivery.
            </div>
          </div>
        ))}
        {messages.length > 0 && (
          <div className="chat-products">
            {products.slice(0, 2).map((p) => (
              <div key={p.id}>
                <img src={p.image} />
                <span>
                  <b>{p.name}</b>
                  <small>{peso(p.price)}</small>
                </span>
                <button onClick={() => add(p)}>
                  <Icon name="plus" size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="suggestions">
          {["Anniversary under ₱1,500", "Something cheerful today"].map((x) => (
            <button onClick={() => setInput(x)} key={x}>
              {x}
            </button>
          ))}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a gift idea..."
        />
        <button>
          <span>→</span>
        </button>
      </form>
    </aside>
  );
}

function Footer({ navigate }: { navigate: (p: string) => void }) {
  return (
    <footer>
      <div className="footer-brand">
        <div className="brand">
          <Icon name="flower" size={25} />
          <span>
            Blooms <i>PH</i>
          </span>
        </div>
        <p>Thoughtful flowers, made by hand and delivered with care across Metro Manila.</p>
      </div>
      {[
        ["Shop", "All flowers", "Same-day delivery", "Best sellers", "Seasonal"],
        ["About", "Our story", "Delivery guide", "Flower care", "Contact us"],
        ["Help", "FAQs", "Track an order", "Policies", "Admin portal"],
      ].map((g, i) => (
        <div key={g[0]}>
          <h4>{g[0]}</h4>
          {g.slice(1).map((x) => (
            <button
              onClick={() =>
                x === "Admin portal"
                  ? navigate("admin")
                  : x === "Track an order"
                    ? navigate("tracking")
                    : navigate("shop")
              }
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
      ))}
      <div className="footer-bottom">
        <span>© 2025 Blooms PH. Made with care in Manila.</span>
        <span>Instagram · Facebook · Pinterest</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("blooms-products") || "null") || seedProducts;
    } catch {
      return seedProducts;
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("blooms-orders") || "null") || seedOrders;
    } catch {
      return seedOrders;
    }
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const [toast, setToast] = useState("");
  const [confirmed, setConfirmed] = useState<Order | null>(null);
  useEffect(() => localStorage.setItem("blooms-products", JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem("blooms-orders", JSON.stringify(orders)), [orders]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  const navigate = (p: string) => {
    setPage(p);
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const add = (p: Product, size = "Standard", addon?: string) => {
    setCart((c) => [...c, { product: p, size, quantity: 1, addon }]);
    setQuick(null);
    setToast(`${p.name} added to your bag`);
  };
  const place = (recipient: string, date: string, slot: string) => {
    const total = cart.reduce((s, x) => s + x.product.price * x.quantity, 250);
    const o: Order = {
      ref: `BLM-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: "Mia Santos",
      recipient,
      date,
      slot,
      total,
      status: "Pending",
      items: cart,
    };
    setOrders((x) => [o, ...x]);
    setCart([]);
    setConfirmed(o);
    navigate("confirmation");
  };
  const reorder = (o: Order) => {
    const items = o.items.length
      ? o.items
      : [{ product: products[0], size: "Standard", quantity: 1 }];
    setCart((c) => [...c, ...items]);
    setToast("Previous order added to your bag");
    setCartOpen(true);
  };
  const currentOrder = confirmed || orders[0];
  const isAdmin = page === "admin";
  return (
    <div className={isAdmin ? "admin-app" : ""}>
      {!isAdmin && page !== "checkout" && (
        <Header
          navigate={navigate}
          openCart={() => setCartOpen(true)}
          count={cart.reduce((s, x) => s + x.quantity, 0)}
        />
      )}
      {page === "home" && (
        <Home products={products} navigate={navigate} quick={setQuick} add={add} />
      )}
      {page === "shop" && <Shop products={products} quick={setQuick} add={add} />}
      {page === "checkout" && <Checkout cart={cart} place={place} navigate={navigate} />}
      {page === "confirmation" && confirmed && (
        <Confirmation order={confirmed} navigate={navigate} />
      )}
      {page === "account" && <Account orders={orders} navigate={navigate} reorder={reorder} />}
      {page === "tracking" && <Tracking order={currentOrder} />}
      {page === "admin" && (
        <Admin
          products={products}
          setProducts={setProducts}
          orders={orders}
          setOrders={setOrders}
          navigate={navigate}
          toast={setToast}
        />
      )}
      {!isAdmin && !["checkout", "confirmation"].includes(page) && <Footer navigate={navigate} />}
      {!isAdmin && !["checkout", "confirmation"].includes(page) && (
        <GiftAssistant products={products} add={add} />
      )}
      {quick && <QuickView product={quick} close={() => setQuick(null)} add={add} />}
      {cartOpen && (
        <CartDrawer
          items={cart}
          close={() => setCartOpen(false)}
          update={(i, n) =>
            n < 1
              ? setCart((c) => c.filter((_, j) => j !== i))
              : setCart((c) => c.map((x, j) => (j === i ? { ...x, quantity: n } : x)))
          }
          remove={(i) => setCart((c) => c.filter((_, j) => j !== i))}
          checkout={() => navigate("checkout")}
        />
      )}
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" size={15} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}
