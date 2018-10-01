#!/opt/conda/envs/qt/bin/python3

import os, sys

if os.fork() != 0:
    sys.exit()

from PyQt5 import QtGui, QtCore, QtWidgets

from PyQt5.QtGui import *
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *


class ImagePlayer(QWidget):

    def __init__(self, filename, parent=None):

        QWidget.__init__(self, parent)

        self.setWindowFlags(QtCore.Qt.WindowStaysOnTopHint | QtCore.Qt.FramelessWindowHint)

        self.setStyleSheet("background-color: black;");
        self.setAutoFillBackground(True)

        self.movie = QMovie(filename, parent=self)

        self.screen = QLabel()
        self.screen.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        self.screen.setAlignment(Qt.AlignCenter)
        self.screen.setMovie(self.movie)

        layout = QGridLayout()
        layout.addWidget(self.screen, 0, 0)
        self.setLayout(layout)

        self.movie.setCacheMode(QMovie.CacheAll)
        self.movie.setSpeed(100)
        self.movie.start()

    def mousePressEvent(self, event):
        sys.exit()


if __name__ == "__main__":

    image = os.path.join(os.path.dirname(os.path.realpath(__file__)), "pennywise.gif")

    app = QApplication([])

    desktop = app.desktop()

    screenCount = desktop.screenCount()
    screens = [desktop.availableGeometry(i) for i in range(screenCount)]
    widgets = [ImagePlayer(image, desktop.screen(i)) for i in range(screenCount)]

    for i in range(screenCount):

        screen = screens[i]
        widget = widgets[i]

        x = screen.x() + screen.width() - widget.width()
        y = screen.y() + screen.height() - widget.height();

        widget.move(x, y)
        widget.show()

    sys.exit(app.exec_())
