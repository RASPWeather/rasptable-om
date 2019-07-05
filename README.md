# A viewer for RASP output using OpenMap Mapping

It should be possible to place all the files into a single location and it will then operate against the UK RASP set of data files.

To revise the code for your model/s:

- You will need to find a map source for your location as the map source is UK only. Adjust the value *scAttributionOSM* inside *config.js* to your map source.

- Adjust the JSON inside config.js for both the models you are using, their centre locations and corners. Focus on *jcModelList* for your models and make sure they align to the entries in *jcFullSupportedModels*.

- Adjust *sForecastServerRoot* to your source of images and data files.
 
- Adjust *jcFullSupportedParameters* for the parameters in use (this is built into the parameter list)

- Adjust *jcModelSoundings* for the soundings in use.

- Adjust *jcGlidingSites* for the gliding locations of interest where you are.

Lastly ... try it out and see how you get on!
