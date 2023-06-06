import numpy as np
import argparse
import cv2 as cv
import subprocess
import time
import os
from app.yolo_utils import infer_image, show_image
import pandas as pd
from flask import Flask, render_template, Response
def gen():
	parser = argparse.ArgumentParser()
	#############default parameters for testing pourpose##############

	parser.add_argument('-m', '--model-path',
		type=str,
		default='D:\\roua_laadouz\objectDetectionBilling\\app\yolov3-coco\\',
		help='The directory where the model weights and \
			  configuration files are.')

	parser.add_argument('-w', '--weights',
		type=str,
		default='D:\\roua_laadouz\objectDetectionBilling\\app\yolov3-coco\yolov3.weights',
		help='Path to the file which contains the weights \
			 	for YOLOv3.')

	parser.add_argument('-cfg', '--config',
		type=str,
		default='D:\\roua_laadouz\objectDetectionBilling\\app\yolov3-coco\yolov3.cfg',
		help='Path to the configuration file for the YOLOv3 model.')

	parser.add_argument('-vo', '--video-output-path',
		type=str,
        default='./output.avi',
		help='The path of the output video file')

	parser.add_argument('-l', '--labels',
		type=str,
		default='D:\\roua_laadouz\objectDetectionBilling\\app\yolov3-coco\coco-labels',
		help='Path to the file having the \
					labels in a new-line seperated way.')

	parser.add_argument('-c', '--confidence',
		type=float,
		default=0.85,
		help='The model will reject boundaries which has a \
				probabiity less than the confidence value. \
				default: 0.85')

	parser.add_argument('-th', '--threshold',
		type=float,
		default=0.3,
		help='The threshold to use when applying the \
				Non-Max Suppresion')

	FLAGS, unparsed = parser.parse_known_args()
#############################################################################

	# Get the labels
	labels = open(FLAGS.labels).read().strip().split('\n')

	# Intializing colors to represent each label uniquely
	colors = np.random.randint(0, 255, size=(len(labels), 3), dtype='uint8')

	# Load the weights and configutation to form the pretrained YOLOv3 model
	net = cv.dnn.readNetFromDarknet(FLAGS.config, FLAGS.weights)

	# Get the output layer names of the model
	layer_names = net.getLayerNames()
	layer_names = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
        
# Infer real-time from webcam to webapp
	count = 0

	vid = cv.VideoCapture(0) #change 0 for webcam 1 for external camera but mounted to edge server
	#vid=cv.VideoCapture(ip address)for remoe camera connected to server
	while True:
		_, frame = vid.read()
		height, width = frame.shape[:2]

		if count == 0:
			frame, boxes, confidences, classids, idxs = infer_image(net, layer_names, \
								height, width, frame, colors, labels, FLAGS)
			count += 1
			
		else:
			frame, boxes, confidences, classids, idxs = infer_image(net, layer_names, \
								height, width, frame, colors, labels, FLAGS, boxes, confidences, classids, idxs, infer=False)
			count = (count + 1) % 6
		cv.imwrite('item.jpg',frame)
		yield (b'--frame\r\n'
			b'Content-Type: image/jpeg\r\n\r\n' + open('item.jpg', 'rb').read() + b'\r\n')
