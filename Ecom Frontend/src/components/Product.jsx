import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  const formatReleaseDate = (rawDate) => {
    if (!rawDate) return "N/A";
    const parts = rawDate.split("-");
    if (parts.length !== 3) return "N/A";

    const [day, month, year] = parts;
    const parsedDate = new Date(`${year}-${month}-${day}`); // Proper ISO format\
    return isNaN(parsedDate.getTime()) ? "N/A" : parsedDate.toLocaleDateString("en-GB");

  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="containers" style={{ display: "flex" }}>
      <img
        className="left-column-img"
        src={imageUrl}
        alt={product.imageName}
        style={{ width: "50%", height: "auto" }}
      />
      <div className="right-column" style={{ width: "50%" }}>
        <div className="product-description">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>
              {product.category}
            </span>
            <p className="release-date" style={{ marginBottom: "2rem" }}>
              <h6>
                Listed: <span><i>{formatReleaseDate(product.release_date)}</i></span>
              </h6>
            </p>
          </div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px' }}>
            {product.name}
          </h1>
          <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
          <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>
            PRODUCT DESCRIPTION:
          </p>
          <p style={{ marginBottom: "1rem" }}>{product.description}</p>
        </div>

        <div className="product-price">
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {"₹" + product.price.toLocaleString()}
          </span>
          <button
            className={`cart-btn ${!product.available ? "disabled-btn" : ""}`}
            onClick={handlAddToCart}
            disabled={!product.available}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            {product.available ? "Add to cart" : "Out of Stock"}
          </button>
          <h6 style={{ marginBottom: "1rem" }}>
            Stock Available:{" "}
            <i style={{ color: "green", fontWeight: "bold" }}>
              {product.quantity}
            </i>
          </h6>
        </div>

        <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleEditClick}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={deleteProduct}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
