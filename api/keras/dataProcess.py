import os
import json
import numpy as np

zi_dict_path = 'data/zi2index.json' # '<PAD>' = 0
sentence_dict_path = 'data/sentence_dict.json'
corpus_path = 'data/train.txt'
max_length = 20

def creat_zi_dict(corpus=corpus_path, zi_dict_path=zi_dict_path):
  zi_dict = {}
  count = 1
  corpus_file = open(corpus, 'r', encoding='utf-8')
  for sentence in corpus_file.readlines():
    for zi in sentence:
      if not zi in zi_dict:
        zi_dict[zi] = count
        count+=1
  corpus_file.close()
  with open(zi_dict_path, 'w', encoding='utf-8') as f:
    json.dump(zi_dict, f)

def creat_sentence_dict(corpus=corpus_path, sentence_dict_path=sentence_dict_path):
  sentence_dict = {}
  count = 0
  corpus_file = open(corpus, 'r', encoding='utf-8')
  for sentence in corpus_file.readlines():
    sentence_dict[count] = sentence
    count+=1
  corpus_file.close()
  with open(sentence_dict_path, 'w', encoding='utf-8') as f:
    json.dump(sentence_dict, f)

def sentence2vector(sentence, max_length=max_length, zi_dict_path=zi_dict_path):
  dict_json = open(zi_dict_path, 'r', encoding='utf-8')
  zi_dict = json.load(dict_json)
  sentence_vector = []
  if len(sentence) >= max_length:
    for i in range(max_length):
      if sentence[i] in zi_dict:
        sentence_vector.append(zi_dict[sentence[i]])
      else:
        sentence_vector.append(0)
  else:
    for zi in sentence:
      if zi in zi_dict:
        sentence_vector.append(zi_dict[zi])
      else:
        sentence_vector.append(0)
    for i in range(max_length - len(sentence)): # 填充至最大长度
      sentence_vector.append(0)
  return sentence_vector
  # return sentence_vector
  # return np.array(sentence_vector)

def index2sentence(index, sentence_dict_path=sentence_dict_path):
  with open(sentence_dict_path, 'r', encoding='utf-8') as f:
    sentence_dict = json.load(fp=f)
    if index in sentence_dict:
      return sentence_dict[int(index+1)]
    else:
      return '预测溢出'
      # return sentence_dict[len(sentence_dict)]

def load_data(train_file=corpus_path):
  with open(train_file, 'r', encoding='utf-8') as f:
    X = []
    y = []
    i = 1
    for line in f.readlines():
      X.append(sentence2vector(line))
      y.append(i)
      i+=1
    return np.array(X), np.array(y)

if __name__ == '__main__':
  creat_zi_dict()
  a = sentence2vector('我是共产党人')