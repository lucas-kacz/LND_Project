from flask import Flask

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

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, world!</p>"


@app.route('/getWalletBalance')
def getWalletBalance():
    cert = open(os.path.expanduser('~/.lnd/tls.cert'), 'rb').read()
    creds = grpc.ssl_channel_credentials(cert)
    channel = grpc.secure_channel('localhost:10009', creds)
    stub = lnrpc.LightningStub(channel)

    response = stub.WalletBalance(ln.WalletBalanceRequest(), metadata=[('macaroon', macaroon)])
    return [response.total_balance]
