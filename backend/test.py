import lightning_pb2 as ln
import lightning_pb2_grpc as lnrpc
import grpc
import os

import codecs

with open(os.path.expanduser('~/.lnd/data/chain/bitcoin/signet/admin.macaroon'), 'rb') as f:
    macaroon_bytes = f.read()
    macaroon = codecs.encode(macaroon_bytes, 'hex')

# Due to updated ECDSA generated tls.cert we need to let gprc know that
# we need to use that cipher suite otherwise there will be a handhsake
# error when we communicate with the lnd rpc server.
os.environ["GRPC_SSL_CIPHER_SUITES"] = 'HIGH+ECDSA'

# Lnd cert is at ~/.lnd/tls.cert on Linux and
# ~/Library/Application Support/Lnd/tls.cert on Mac
cert = open(os.path.expanduser('~/.lnd/tls.cert'), 'rb').read()
creds = grpc.ssl_channel_credentials(cert)
channel = grpc.secure_channel('localhost:10009', creds)
stub = lnrpc.LightningStub(channel)

response = stub.WalletBalance(ln.WalletBalanceRequest(), metadata=[('macaroon', macaroon)])
print(response.total_balance)
