所涉及地图要素数据都由Geoserver发布，该部分需要自己配置，同时记得在vite.config中将代理地址进行更改，获取的数据的函数在Geoserver.ts文件中需要传入服务的工作空间名称和图层名称。
Public文件存放了静态资源，其中NewYork里都是城市数据，通过Geoserver发布，或者用GIS软件转成JSON处理都可以
