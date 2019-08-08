from flask_restful import Resource
from flask import request
from InTexT.algorithm.models import *
import os

print(os.getcwd())
dic_path = "./InTexT/algorithm/zhs.model/char_dic.json"
emb_path = "./InTexT/algorithm/ChineseELMo.hdf5"
corpus_path = "./InTexT/algorithm/corpus.txt"
corpus_feature_path = "./InTexT/algorithm/corpus_feature.pkl"

class Sentences(Resource):
    def post(self):
        sentences = Sample(dic_path=dic_path, # str2vector的字典路径
                    corpus_path=corpus_path, # 语料库路径
                    emb_path=emb_path, # emb模型路径
                    corpus_feature_path=corpus_feature_path, # 提取到的语料库特征路径 
                    topk=2) # 返回最有可能是下一句的句子个数
        args = {}
        args['qurey_sentence'] = request.json.get('qurey_sentence', False)
        print(args['qurey_sentence'])
        try:
            print(sentences.search(args['qurey_sentence']))
            return sentences.search(args['qurey_sentence'])
        except:
            return {'message': 'Something went wrong'}, 500
