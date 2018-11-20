from model import Model
import dataProcess
import numpy as np

max_length = 20

def main():
  X, y = dataProcess.load_data()
  myModel = Model()
  myModel.build_model()
  myModel.compile()
  myModel.train(X, y)


  index = myModel.predict(sentence2vector("加强现代化建设"))
  dataProcess.creat_sentence_dict()
  print(dataProcess.index2sentence(2))

if __name__ == '__main__':
  main()
