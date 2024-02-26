import socket
import threading

def send_message():
    while True:
        message = input('Enter message: ')
        client_socket.sendto(message.encode(), server_address)

def receive_message():
    while True:
        data, address = client_socket.recvfrom(4096)
        print(f'Received message: {data.decode()}')
        print('Enter message: ', end='', flush=True)  

client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
client_socket.bind(('localhost', 12370))  

server_address = ('localhost', 12371)

send_thread = threading.Thread(target=send_message)
receive_thread = threading.Thread(target=receive_message)

send_thread.start()
receive_thread.start()

send_thread.join()
receive_thread.join()
