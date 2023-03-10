import styled from "styled-components";
import { Dropdown, Card, FormControl } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getCoinList } from "../../data/index";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Coinlist from "../../data/CoinList/Coinlist.json";

const StyledCard = styled(Card)`
  width: 100%;
  background: linear-gradient(90deg, #bfebf1, #e9f8fa);
  color: #bd2818;

  .card-body {
    padding: 0.5rem 1rem;
  }

  button {
    width: 100%;
    background-color: #d4ebf0;
    color: #e43a27;
    border: 0.9px dotted #184cb4;
  }

  .btn:hover {
    background-color: #05445e;
  }

  .btn.show {
    background-color: #189ab4;
  }

  .card-text {
    text-align: center;

    @media (min-width: 576px) {
      margin-top: 10%;
      scale: 1.2;
    }
  }

  .dropdown-menu {
    max-height: 250px;
    overflow: scroll;
    padding-top: 0;

    .form-control {
      position: sticky;
      top: 0;
      z-index: 1;
      background-color: #fff;
      padding: 0.5rem;
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;
    }
  }
`;

function CardBST({ InitSymbol, CardCurrentPrice }) {
  const [SearchValue, setSearchValue] = useState("");
  const [ListOfCoin, setListOfCoin] = useState([]);
  const [FilteredCoin, setFilteredCoin] = useState([]);
  const [SelectedCoin, setSelectedCoin] = useState("");
  const [CurrentPrice, setCurrentPrice] = useState("");

  // Fetch Data First Time and set To ListOfCoin

  useEffect(() => {
    const fetchCoinList = async () => {
      const list = await getCoinList();
      setListOfCoin(list);
      setFilteredCoin(list);
    };
    fetchCoinList();
  }, []);

  //Handle Value From Search Box

  const handleSearch = (e) => {
    setSearchValue(e.target.value);

    if (e.target.value === "") {
      setFilteredCoin(ListOfCoin);
    } else {
      getCoinList(e.target.value).then((filtered) => {
        setFilteredCoin(filtered);
      });
    }
  };

  //Handle Selected Coin

  const handleSelect = (item) => {
    console.log(item);
    setSelectedCoin(item.symbol);
  };

  // Fetch Current Price

  useEffect(() => {
    if (!SelectedCoin) {
      // console.log("InitSymbol is ", InitSymbol, " Price", CardCurrentPrice);
      setCurrentPrice(CardCurrentPrice);
    } else {
      if (InitSymbol !== SelectedCoin) {
        const getCoinIds = () => {
          const coin = Coinlist.find(
            (coin) => coin.symbol === SelectedCoin.toLowerCase()
          );
          return coin ? coin.id : null;
        };

        const CoinID = getCoinIds(SelectedCoin);

        const FetchCurrentPrice = async () => {
          try {
            const response = await axios.get(
              `https://api.coingecko.com/api/v3/simple/price?ids=${CoinID}&vs_currencies=usd`
            );
            console.log(
              "SelectCoin is ",
              SelectedCoin,
              " Price",
              response.data[CoinID].usd
            );
            // console.log(response);
            setCurrentPrice(response.data[CoinID].usd);
          } catch (error) {
            console.log("Error fetching current price: ", error);
            setCurrentPrice(CardCurrentPrice);
          }
        };
        FetchCurrentPrice();
      } else {
        setCurrentPrice(CardCurrentPrice);
      }
    }
  }, [CardCurrentPrice, SelectedCoin]);

  return (
    <StyledCard>
      <Card.Body>
        <Card.Title>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              {SelectedCoin
                ? SelectedCoin.toUpperCase()
                : InitSymbol.toUpperCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <FormControl
                type="text"
                placeholder="Search"
                value={SearchValue}
                onChange={handleSearch}
              ></FormControl>
              {FilteredCoin.map((item) => (
                <Dropdown.Item
                  key={uuidv4()}
                  onClick={() => handleSelect(item)}
                >
                  {item.symbol.toUpperCase()}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Card.Title>
        <Card.Text>{CurrentPrice} $</Card.Text>
      </Card.Body>
    </StyledCard>
  );
}

export default CardBST;
