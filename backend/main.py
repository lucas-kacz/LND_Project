from flask import Flask, jsonify, make_response
from flask_cors import CORS

import jsonpickle
import json

#LND GRPC Libraries
import lightning_pb2 as ln
import lightning_pb2_grpc as lnrpc
import grpc
import os

from google.protobuf.json_format import MessageToJson

import codecs

#Retrieve the macaroon for the signet network
with open(os.path.expanduser('~/.lnd/data/chain/bitcoin/signet/admin.macaroon'), 'rb') as f:
    macaroon_bytes = f.read()
    macaroon = codecs.encode(macaroon_bytes, 'hex')

os.environ["GRPC_SSL_CIPHER_SUITES"] = 'HIGH+ECDSA'

cert = open(os.path.expanduser('~/.lnd/tls.cert'), 'rb').read()
creds = grpc.ssl_channel_credentials(cert)
channel = grpc.secure_channel('localhost:10009', creds)
stub = lnrpc.LightningStub(channel)

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, world!</p>"


@app.route('/getWalletBalance')
def getWalletBalance():
    response = stub.WalletBalance(ln.WalletBalanceRequest(), metadata=[('macaroon', macaroon)])
    return [response.total_balance]


@app.route('/connectNode')
def connectNode():
    response = stub.ConnectPeer(ln.ConnectPeerRequest(addr=ln.LightningAddress(pubkey="03ddab321b760433cbf561b615ef62ac7d318630c5f51d523aaf5395b90b751956")), metadata=[('macaroon', macaroon)])
    return [response]

@app.route('/listPeers')
def listPeers():
    #response = stub.ListPeers(ln.ListPeersResponse(), metadata=[('macaroon', macaroon)])
    request = ln.ListPeersRequest()
    response = stub.ListPeers(request, metadata=[('macaroon', macaroon)])
    response_json = MessageToJson(response)
    print(response_json)
    return make_response(response_json, 200)

