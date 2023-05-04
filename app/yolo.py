import numpy as np
import argparse
import cv2 as cv
import subprocess
import time
import os
from app.yolo_utils import infer_image, show_image
import pandas as pd

FLAGS = []

def detectionofkstore(): #function to get detected class id and conture values
	parser = argparse.ArgumentParser()

	parser.add_argument('-m', '--model-path',
		type=str,
		default='D:\\roua_laadouz\objectDetectionBilling\\app\yolov3-coco\yolov3-coco\\',
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

	parser.add_argument('-l', '--labels',
		type=str,
		default='D:\\roua_laadouz\objectDetectionBilling\\app\yolov3-coco\coco-labels',
		help='Path to the file having the \
					labels in a new-line seperated way.')

	parser.add_argument('-c', '--confidence',
		type=float,
		default=0.5,
		help='The model will reject boundaries which has a \
				probabiity less than the confidence value. \
				default: 0.5')

	parser.add_argument('-th', '--threshold',
		type=float,
		default=0.3,
		help='The threshold to use when applying the \
				Non-Max Suppresion')

	FLAGS, unparsed = parser.parse_known_args()

	# Download the YOLOv3 models if needed
	# Get the labels
	labels = open(FLAGS.labels).read().strip().split('\n')

	# Intializing colors to represent each label uniquely
	colors = np.random.randint(0, 255, size=(len(labels), 3), dtype='uint8')

	# Load the weights and configutation to form the pretrained YOLOv3 model
	net = cv.dnn.readNetFromDarknet(FLAGS.config, FLAGS.weights)

	# Get the output layer names of the model
	layer_names = net.getLayerNames()
	layer_names = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
	count=0
	# Read the image
	try:
		img = cv.imread('item.jpg')#read the object shown
		height, width = img.shape[:2]
	except:
		raise 'Image cannot be loaded!\n\
							Please check the path provided!'

	finally:
		img, _, _, _, _ = infer_image(net, layer_names, height, width, img, colors, labels, FLAGS)
		if count == 0:
			frame, boxes, confidences, classids, idxs = infer_image(net, layer_names,height, width, img, colors, labels, FLAGS)
			count += 1
		else:
			frame, boxes, confidences, classids, idxs = infer_image(net, layer_names,height, width, img, colors, labels, FLAGS, boxes, confidences, classids, idxs, infer=False)
			count = (count + 1) % 6
	return classids,boxes




