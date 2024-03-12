# ENGO551-Lab4
This web map application is an interactive web map application to visualize the vehicle incidents in Calgary in 2017. It shows users the location of each incident and its information including description, incident info, and the time when it happended.

The style of the map application comes from Mapbox and most of the applications are done using mapbox gl js API.

On the web page there are two buttons: layer button and refresh botton. When the user clicks on the layer button, the incidents layers are hiddle or shown based on the previous state. When the user clicks on the refresh button, the web page will get back to the default setup with all the layers shown.

There are two layers in the map to visualize the incidents: cluster layer and uncluster point layer. Cluster layer contains multiple incidents in big circles. The circle tells you the number of incidents it cover. The more the incidents it covers, the larger the circle is and the circle is yellow or red. The cluster circles are set to be 50% transparent by default so that users can find the place they want to look into. However, if the mouse is hovered over the circle, the circle will get non-transparent. Users can click on it to zoom in to see more detail.

The uncluster points appears when they are sparse. Every point represent a single incident happened. Points are red solid dot so that they can be outstanding from the context. The mouse will convert to pointer shape when hovered over the dot. Users can get the incident information by clicking on the dot.