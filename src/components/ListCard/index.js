import './index.css'

const ListCard = props => {
  const {details} = props
  const {name, imageUrl} = details

  return (
    <li className="list-item">
      <img src={imageUrl} alt={name} className="item-img" />
      <p className="item-name">{name}</p>
    </li>
  )
}

export default ListCard
