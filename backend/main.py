from flask import Flask
from flask_cors import CORS

#LND GRPC Libraries
import lightning_pb2 as ln
import lightning_pb2_grpc as lnrpc
import grpc
import os

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
