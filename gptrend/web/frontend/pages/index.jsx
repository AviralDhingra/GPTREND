import { TitleBar } from "@shopify/app-bridge-react";
import {
  AlphaCard,
  Image,
  Layout,
  LegacyStack,
  Page,
  Text,
  TextContainer,
} from "@shopify/polaris";

import { trophyImage } from "../assets";

import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState("");
  const [product, setProduct] = useState("");
  const [display, setDisplay] = useState(false);
  const [data, setData] = useState("");

  return (
    <Page narrowWidth>
      <TitleBar title="GPTREND" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <AlphaCard sectioned>
            <LegacyStack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <LegacyStack.Item fill>
                <TextContainer spacing="loose">
                  <Text as="h2" variant="headingMd">
                    Welcome to GPTREND
                  </Text>
                  <p>
                    We bring the benifits of an amazon-like recommendation
                    system to shop owners on shopify without any of the
                    headaches
                  </p>
                </TextContainer>
              </LegacyStack.Item>
              <LegacyStack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImage}
                    alt="Nice work on building a Shopify app"
                    width={180}
                    height={100}
                  />
                </div>
              </LegacyStack.Item>
            </LegacyStack>
          </AlphaCard>
        </Layout.Section>
        <Layout.Section>
          <AlphaCard>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                var requestOptions = {
                  method: "GET",
                  redirect: "follow",
                };

                fetch(
                  encodeURI(
                    `http://127.0.0.1:5000/?productName=${product}&csvStr=${file}`
                  ),
                  requestOptions
                )
                  .then((response) => response.json())
                  .then((res) => {
                    console.log(res);
                    setData(JSON.stringify(res));
                  })
                  .then(() => {
                    setDisplay(true);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                // setData("This is a test");
              }}
            >
              <label>Please input the google sheet URL of the CSV</label>
              <br />
              <input
                type="text"
                placeholder="Product Name"
                value={product}
                onChange={(e) => {
                  e.preventDefault();
                  console.log(e.target.value);
                  setProduct(e.target.value);
                }}
              />
              <br />
              <input
                type="file"
                accept=".csv"
                placeholder="CSV File"
                onChange={(e) => {
                  e.preventDefault();
                  const fileTemp = e.target.files[0];

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const csvData = event.target.result;
                    console.log(csvData);
                    setFile(csvData);
                  };
                  reader.readAsText(fileTemp);
                }}
              />
              <br />
              <input type="submit" />
            </form>
            {/* {
                (display ? <p>{data}</p> : null)

              } */}
            <p>{data}</p>
          </AlphaCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
