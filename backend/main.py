from flask import Flask, jsonify, make_response, request
from flask_cors import CORS

import json

import base64
import binascii

#LND GRPC Libraries
import lightning_pb2 as ln
import lightning_pb2_grpc as lnrpc
import grpc
from grpc import RpcError
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
    response_json = MessageToJson(response)
    return make_response(response_json, 200)


@app.route('/connectNode/<node_pubkey>/<host>', methods = ['POST'])
def connectNode(node_pubkey, host):
    if request.method == 'POST':
        try:
            response = stub.ConnectPeer(ln.ConnectPeerRequest(addr=ln.LightningAddress(pubkey=node_pubkey, host=host), timeout=10), metadata=[('macaroon', macaroon)])
            return "Connected"
        except RpcError as e:
            if "Failed to connect to all addresses" in str(e):
                return "Failed to connect to the node. Check the node's address and try again."
            elif "Permission denied" in str(e):
                return "Permission denied. Make sure you have the required permissions to connect to the node."
            else:
                return f"An error occurred: {str(e)}"
        except Exception as e:
            return f"An unexpected error occurred: {str(e)}"
    else:
        return "Method not allowed. Please use the POST method to connect to the node."
    
@app.route('/disconnectPeer/<node_pubkey>', methods = ['POST'])
def disconnectPeer(node_pubkey):
    if request.method == 'POST':
        try:
            response = stub.DisconnectPeer(ln.DisconnectPeerRequest(addr=ln.LightningAddress(pubkey=node_pubkey)), metadata=[('macaroon', macaroon)])
            return [response]
        except RpcError as e:
            if "Failed to connect to all addresses" in str(e):
                return "Failed to connect to the node. Check the node's address and try again."
            elif "Permission denied" in str(e):
                return "Permission denied. Make sure you have the required permissions to connect to the node."
            else:
                return f"An error occurred: {str(e)}"
        except Exception as e:
            return f"An unexpected error occurred: {str(e)}"
    else:
        return "Method not allowed. Please use the POST method to connect to the node."

#List all peers
@app.route('/listPeers')
def listPeers():
    #response = stub.ListPeers(ln.ListPeersResponse(), metadata=[('macaroon', macaroon)])
    request = ln.ListPeersRequest()
    response = stub.ListPeers(request, metadata=[('macaroon', macaroon)])
    response_json = MessageToJson(response)
    print(response_json)
    return make_response(response_json, 200)

#List all opened channels
@app.route('/listChannels')
def listChannels():
    #response = stub.ListPeers(ln.ListPeersResponse(), metadata=[('macaroon', macaroon)])
    request = ln.ListChannelsRequest()
    response = stub.ListChannels(request, metadata=[('macaroon', macaroon)])
    response_json = MessageToJson(response)
    print(response_json)
    return make_response(response_json, 200)

@app.route('/openChannel/<node_pubkey>/<local_funding_amount>', methods = ['POST'])
def openChannel(node_pubkey, local_funding_amount):
    local_funding_amount_int = max(int(local_funding_amount), 546)
    node_pubkey_bytes = binascii.unhexlify(node_pubkey)
    request = ln.OpenChannelRequest(node_pubkey=node_pubkey_bytes, local_funding_amount=local_funding_amount_int)
    
    # Handle the stream of responses
    for response in stub.OpenChannel(request, metadata=[('macaroon', macaroon)]):
        response_json = MessageToJson(response)
        print(response_json)

@app.route('/closeChannel/<channel_point>', methods = ['POST'])
def closeChannel(channel_point):
    #channel_point_bytes = binascii.unhexlify(channel_point)
    request = ln.CloseChannelRequest(channel_point=ln.ChannelPoint(funding_txid_str=channel_point))
    
    # Handle the stream of responses
    for response in stub.CloseChannel(request, metadata=[('macaroon', macaroon)]):
        response_json = MessageToJson(response)
        print(response_json)


@app.route('/createInvoice')
def createInvoice():
    request = ln.Invoice()
