import tkinter as tk
import time


class GUI:
    def __init__(self, master):
        self.master = master
        self.master.title("Robot Controller")

        self.current_command = None
        self.command_label = tk.Label(master, text="")
        self.command_label.pack()

        button_frame = tk.Frame(master)
        button_frame.pack()

        self.forward_button = tk.Button(button_frame, text="Forward", command=self.forward_command)
        self.forward_button.grid(row=0, column=1, padx=50, pady=50)

        self.backward_button = tk.Button(button_frame, text="Backward", command=self.backward_command)
        self.backward_button.grid(row=1, column=1, padx=5, pady=5)

        self.left_button = tk.Button(button_frame, text="Left", command=self.left_command)
        self.left_button.grid(row=1, column=0, padx=5, pady=5)

        self.right_button = tk.Button(button_frame, text="Right", command=self.right_command)
        self.right_button.grid(row=1, column=2, padx=5, pady=5)

        self.rotate_left_button = tk.Button(button_frame, text="Rotate Left", command=self.rotate_left_command)
        self.rotate_left_button.grid(row=0, column=0, padx=5, pady=5)

        self.rotate_right_button = tk.Button(button_frame, text="Rotate Right", command=self.rotate_right_command)
        self.rotate_right_button.grid(row=0, column=2, padx=5, pady=5)

        self.stop_button = tk.Button(button_frame, text="Stop", command=self.stop_command)
        self.stop_button.grid(row=2, column=1, padx=5, pady=50)

    def forward_command(self):
        self.execute_command("Forward")

    def backward_command(self):
        self.execute_command("Backward")

    def left_command(self):
        self.execute_command("Left")

    def right_command(self):
        self.execute_command("Right")

    def rotate_left_command(self):
        self.execute_command("Rotate Left")

    def rotate_right_command(self):
        self.execute_command("Rotate Right")

    def stop_command(self):
        self.execute_command("Stop")

    def execute_command(self, command):
        if self.current_command != command:
            self.current_command = command
            self.update_label_blink()

    def update_label_blink(self):
        if self.current_command != "Stop":
            self.command_label.config(text=self.current_command)
            self.master.after(200, self.toggle_label_off)
        else:
            self.command_label.config(text="Stop")

    def toggle_label_off(self):
        self.command_label.config(text="")
        self.master.after(200, self.update_label_blink)


def main():
    root = tk.Tk()
    gui = GUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
