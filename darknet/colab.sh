!ls
!git clone https://github.com/sharmaansh/darknet.git
!apt-get update
!apt-get upgrade
!apt-get install build-essential
!apt-get install cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
!apt-get -y install cmake
!which cmake
!cmake --version
!apt-get install vim
%cd darknet/
!ls
!sed -i 's/OPENCV=0/OPENCV=1/g' Makefile
!sed -i 's/GPU=0/GPU=1/g' Makefile
!ls
%cd ../
!ls
!apt install g++-5
!apt install gcc-5
!update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-5 10
!update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-5 20
!update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-5 10
!update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-5 20
!update-alternatives --install /usr/bin/cc cc /usr/bin/gcc 30
!update-alternatives --set cc /usr/bin/gcc
!update-alternatives --install /usr/bin/c++ c++ /usr/bin/g++ 30
!update-alternatives --set c++ /usr/bin/g++
!apt update -qq;
!wget https://developer.nvidia.com/compute/cuda/8.0/Prod2/local_installers/cuda-repo-ubuntu1604-8-0-local-ga2_8.0.61-1_amd64-deb
!dpkg -i cuda-repo-ubuntu1604-8-0-local-ga2_8.0.61-1_amd64-deb
!apt-get update -qq
!apt-get install cuda -y -qq #gcc-5 g++-5 
!apt update
!apt upgrade
!apt install cuda-8.0 -y
%cd darknet
!ls
!make
!ln -s "/content/gdrive/My Drive/darknet/" /mydrive


from google.colab import drive
drive.mount('/content/drive')

!./content/darknet/darknet detector train /content/darknet/data/obj.data /content/darknet/cfg/yolov3-tiny_obj.cfg /content/darknet/yolov3-tiny.conv.15 -dont_show



