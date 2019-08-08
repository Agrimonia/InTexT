from models import *

def main():
    dic_path = "./zhs.model/char_dic.json"
    emb_path = "./ChineseELMo.hdf5"
    corpus_path = "./corpus.txt"
    corpus_feature_path = "./corpus_feature.pkl"

    sample = Sample(dic_path=dic_path, # str2vector的字典路径
                    corpus_path=corpus_path, # 语料库路径
                    emb_path=emb_path, # emb模型路径
                    corpus_feature_path=corpus_feature_path, # 提取到的语料库特征路径 
                    topk=2) # 返回最有可能是下一句的句子个数

    qurey_sentence = '根据《劳动法》、《劳动合同法》及有关规定'  #这是再前端输入的句子
    print(sample.search(qurey_sentence))              #这是输出2的句子

if __name__ == '__main__':
    main()