import socket
import threading

def send_message():
    while True:
        message = input('Enter message: ')
        server_socket.sendto(message.encode(), client_address)

def receive_message():
    while True:
        data, address = server_socket.recvfrom(4096)
        print(f'Received message: {data.decode()}')
        print('Enter message: ', end='', flush=True)  # Print prompt for next message

client_address = ('localhost', 12370)
client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server_address = ('localhost', 12371)
server_socket.bind(server_address)

send_thread = threading.Thread(target=send_message)
receive_thread = threading.Thread(target=receive_message)

send_thread.start()
receive_thread.start()

send_thread.join()
receive_thread.join()
