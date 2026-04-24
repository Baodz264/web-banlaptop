import { Card } from "antd";

const ProductVariants = ({ variants }) => {

  return(

    <Card title="Phiên bản">

      {variants.map(v=>(
        <p key={v.id}>
          {v.price?.toLocaleString()} đ - Kho: {v.stock}
        </p>
      ))}

    </Card>

  )

}

export default ProductVariants;