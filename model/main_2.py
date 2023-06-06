from flask import Flask, request
from flask_restful import Resource, Api
from langchain.agents import create_csv_agent
from langchain.llms import OpenAI
from flask_cors import CORS


# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


class recommendation:
    def __init__(self, productName, csvPath):
        self.productName = productName
        self.csvPath = csvPath

        self.agent = create_csv_agent(OpenAI(temperature=0),
                                      self.csvPath, verbose=True)

    def upSell(self):
        return self.agent.run(
            f"This database contains data on the products an online store is selling. If a customer that visits this website likes the {self.productName}, then is there a similar but better product for them? Limit your recommendations to just 5 products.")

    def crossSell(self):
        return self.agent.run(
            f"This database contains data on the products an online store is selling. If a customer that visits this website likes the {self.productName}, then what else might he want to buy or like? Limit your recommendations to just 5 products.")


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)


class HelloWorld(Resource):
    def get(self):
        # Retrieve the 'name' parameter from the query string
        productName = request.args.get('productName')
        csvStr = request.args.get('csvStr')
        csvPath = "./temp_store/data.csv"

        if os.path.exists(csvPath):
            os.remove(csvPath)

        with open(csvPath, "w") as file:
            file.write(csvStr)

        productRec = recommendation(
            productName, csvPath)

        productsUp = productRec.upSell()
        print(f"Up Sell : {productsUp}")

        productsCross = productRec.crossSell()
        print(f"Cross Sell : {productsCross}")

        products = {
            "upSell": productsUp,
            "crossSell": productsCross
        }

        print(products)
        return products


api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run()


# def finalRun(productName: str, csvStr: str):

#     csvPath = "./temp_store/data.csv"

#     if os.path.exists(csvPath):
#         os.remove(csvPath)

#     with open(csvPath, "w") as file:
#         file.write(csvStr)

#     productRec = recommendation(
#         productName, csvPath)

#     productsUp = productRec.upSell()
#     print(f"Up Sell : {productsUp}")

#     productsCross = productRec.crossSell()
#     print(f"Cross Sell : {productsCross}")

#     products = {
#         "upSell": productsUp,
#         "crossSell": productsCross
#     }

#     print(products)
#     return products


# products_export_1.csv
# 3p Fulfilled Snowboard
