import { useState } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Charger", quantity: 1, packed: true },
// ];



export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) { //needs further understanding ad study
    setItems(items => [...items, item]); 
  }

  function hanleDeleteItem(id) {
    setItems(items => items.filter(item => item.id !== id));
  }

  function handleToggItems(id) {
    setItems(items => items.map(item => item.id === id ? {...item, packed: !item.packed} : item))
  }

  function handleClearItems() {
    setItems([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems}/>
      <PackingList items={items} onDeleteItem={hanleDeleteItem} onToggleItems={handleToggItems} onClearItems={handleClearItems}/>
      <Stats items={items}/>
    </div>
  );
}

function Logo() {
  return <h1> Far Away Travel List</h1>
}

function Form({onAddItems}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return

    const newItem = {description, quantity, packed: false, id: Date.now()};
    // console.log(newItem);

    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip</h3>
      <select value={quantity} onChange={e => setQuantity(parseInt(e.target.value))}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => <option value={num} key={num}>{num}</option>)}
      </select>

      <input type="text" placeholder="items..." value={description} onChange={(e) => setDescription(e.target.value)}/>

      <button>Add</button>
  </form>
  )
}

function PackingList({items, onDeleteItem, onToggleItems, onClearItems}) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === 'input') sortedItems = items;

  if (sortBy === 'description') sortedItems = items.slice().sort((a,b) => a.description.localeCompare(b.description));

  if (sortBy === 'packed') sortedItems = items.slice().sort((a,b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => <Item item={item} onDeleteItem={onDeleteItem} onToggleItems={onToggleItems} key={item.id}/>)}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => {setSortBy(e.target.value)}}>
          <option value='input'>Sort by input order</option>
          <option value='description'>Sort by description</option>
          <option value='packed'>Sort by packed status</option>
        </select>

        <button onClick={() => onClearItems()}>Clear List</button>
      </div>
    </div>
  )
}

function Item({item, onDeleteItem, onToggleItems}) {
  return (
    <li>
      <input type="checkbox" value={item.packed} onChange={() => onToggleItems(item.id)}/>
      <span style={item.packed ? {textDecoration: "line-through"} : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  ) 
}

function Stats({items}) {
  if (!items.length) return <p className="stats"><em>Start adding items to your packing list</em></p>

  const numItems = items.length;
  const numPacked = items.filter(item => item.packed).length
  const percentPacked = Math.round((numPacked / numItems) * 100)


  return(
    <footer className="stats">
      <em>
        {percentPacked === 100 ? "You have packed all your items" :
        `You have ${numItems} items on your list, and you already packed ${numPacked} ({percentPacked})%`
        }
      </em>
    </footer>
  )
}