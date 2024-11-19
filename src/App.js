import logo from './logo.svg';
import './App.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {  faFile } from '@fortawesome/free-solid-svg-icons';
import { FaCheck, FaCopy } from "react-icons/fa";
import { products } from './constants/products';
import _ from "lodash";
import { useState, useEffect } from "react";

interface ProductItem {
  "Product Name": string;
  prices?: { id: string; label: string }[];

}

interface GroupedProducts {
  [key: string]: ProductItem[];
}

function App() {

  const[userID  ,setUserID]=useState("");
  const[product ,setProduct]=useState("");
  const[mode ,setMode]=useState("");
  const [priceID, setPriceID] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    const result: GroupedProducts = _.groupBy(products, "Product Name");
    setGroupedProducts(result);
  }, []);


  const handleProductChange = (e) => {
    const productName = e.target.value; 
    const product = products.find(
      (product) => product["Product Name"] === productName
    );
    setSelectedProduct(product); 
    setProduct(productName);
    setPriceID(""); 
  };
  

  

  const handlePriceChange = (e) => {
    setPriceID(e.target.value); 
  };

   const handleCreatePaymentLink = (e) => {
    e.preventDefault();

    const generatedLink = `https://us-central1-tlloanapp-d0571.cloudfunctions.net/stripePayment/purchase/${userID}/${priceID}?mode=${mode}`;
    setCopyText(generatedLink);
  };

  const handleCopyToClipboard = () => {
    if (copyText) {
      navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); 
    }
  };


  return (
    <div className="App">
    {/* <h2>Create Payment Link</h2> */}
    <div class="container">
    <form onSubmit={handleCreatePaymentLink}>
    <h2>Create Payment Link</h2>
      <label for="userid">User ID:</label>
     
      
     
       <input 
        type="text"
        value={userID}
        onChange={(e) =>setUserID(e.target.value)}
        placeholder='Enter your User ID' 
        required
        spellCheck={false}
        ></input>
      
      
      <label for="product">Product:</label>
     
      

      <select
      value={product}
      onChange={handleProductChange} 
      required
             >
      <option value="">Select product</option>
     
      {Object.keys(groupedProducts).map((productName) => (
              <option key={productName} value={productName}>
                {productName}

              </option>
      ))}
        
      </select>

      {selectedProduct &&
          groupedProducts[selectedProduct["Product Name"]] && (
            <div class="form-field">

              <label >
                Price:
              </label>
              <select
                value={priceID}
                onChange={handlePriceChange}
                required
              
              >
                <option value="" disabled>
                  Select price
                </option>
                {groupedProducts[selectedProduct["Product Name"]].map(
                  (item:products) => (
                    <option
                      key={item["Price ID"]}
                      value={item["Price ID"]}
                    >{`${item.Currency} ${item.Amount},${item["Interval Count"] && item.Interval? `${item["Interval Count"]}  ${item.Interval}`  :" lifetime" }`}
                    </option>
                  )
                )
              }
              </select>
            </div>
          )}


      
        
     
      
     
      <label for="Mode">Mode:</label>
      <div>

      <select
       value={mode}
       onChange={(e) => setMode(e.target.value)}
       required>
           <option value="">Select option</option>
            <option value="payment">One-time Payment</option>
            <option value="subscription">Subscription</option>
          </select>
      </div>
      
     

      
    
      
      
      
      
      <button onClick={handleCopyToClipboard}> <react-icons icon={FaCheck}  /> 
      {isCopied ? "Copied!" : "copy link"}
      {" "}
      {isCopied ? <FaCheck /> : <FaCopy />}
      </button>
      {/* <i class="fa-solid fa-file"></i> */}
      
     
   </form>
   </div>
    </div>
  );
}

export default App;
