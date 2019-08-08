    # 最好和flask一起 import
import torch
import torch.nn as nn
from torch.autograd import Variable
import json
import numpy as np
import pickle as pkl
import h5py

def set_trainable(model, requires_grad):
    for param in model.parameters():
        param.requires_grad = requires_grad

class EmbeddingModel(nn.Module):
    """docstring for EmbeddingModel"""
    def __init__(self, emb_path=None):
        super(EmbeddingModel, self).__init__()
        self.emb = nn.Embedding(6163, 1024)
        self.emb_init(emb_path)

    def emb_init(self, emb_path):
        emb_np = h5py2np(emb_path)
        set_trainable(self.emb, False)
        self.emb.weight.copy_(torch.from_numpy(emb_np))

    def forward(self, x):
        return self.emb(x).data # tensor 兼容 np 运算

class Sample(object):
    """docstring for model"""
    def __init__(self, dic_path, corpus_path, emb_path, corpus_feature_path=None, topk=3):
        super(Sample, self).__init__()
        self.dic_path = dic_path
        self.char_dic = get_dic(self.dic_path)
        self.model = EmbeddingModel(emb_path)
        self.topk = topk
        with open(corpus_path, 'r', encoding='utf-8', errors='ignore') as f:
            self.corpus = f.readlines()
            self.sentence_num = len(self.corpus)
        if corpus_feature_path is not None:
            with open(corpus_feature_path, 'rb') as f:
                self.corpus_feature = pkl.load(f)

    def match(self, qurey): # 返回idx
        self.corpus_feature['sim'] = []
        for idx in self.corpus_feature['index']:
            sim = cosine_similarity(qurey, self.corpus_feature['feature'][idx])
            self.corpus_feature['sim'].append(sim)
        sim_dic = list(zip(self.corpus_feature['index'], self.corpus_feature['sim']))
        sim_dic.sort(key=lambda x:x[1], reverse=True)
        sim_result = sim_dic[:self.topk]
        return sim_result

    def get_feature(self, qurey):
        qurey = tokenize(qurey, self.char_dic)
        return self.model(qurey)

    def search(self, qurey_sentence):
        feature = self.get_feature(qurey_sentence)
        sim_result = self.match(feature)
        sentence = self.idx2sentence(sim_result)
        return sentence

    def idx2sentence(self, sim_result, next_senten=True):
        if next_senten:
            n = 1
        else:
            n = 0

        if isinstance(sim_result, tuple):
            idx = (sim_result[0] + n) % self.sentence_num
            return self.corpus[idx].strip()
        else:
            sentence_list = []
            for result in sim_result:
                idx = (result[0] + n) % self.sentence_num
                sentence_list.append(self.corpus[idx].strip())
            return sentence_list

def get_dic(dic_path):
    with open(dic_path, 'r') as f:
        char_dic = json.load(f)
    return char_dic

def tokenize(qurey, char_dic, len=10): # TODO
    seq = []
    for i in range(len):
        try:
            seq.append(char_dic[qurey[i]])
        except Exception as e: # 发生异常的两种情况： 1.qurey长度不够 2.char不在dic中
            # TODO: 加入 char_dic
            seq.append(0)
    seq = Variable(torch.LongTensor(seq))
    return seq

def h5py2np(hf_path):
    hf = h5py.File(hf_path, 'r')
    key = list(hf.keys())[0]
    return hf[key][:]

# def cosine_similarity(x1, x2):
#     """Returns cosine similarity between x1 and x2, computed along dim."""
#     w12 = np.sum(x1 * x2)
#     w1 = np.linalg.norm(x1)
#     w2 = np.linalg.norm(x2)
#     return 0.5 + 0.5 * (w12 / (w1 * w2))

def cosine_similarity(x1, x2, dim=1, eps=1e-8):
    """Returns cosine similarity between x1 and x2, computed along dim."""
    w12 = torch.sum(x1 * x2, dim)
    w1 = torch.norm(x1, 2, dim)
    w2 = torch.norm(x2, 2, dim)
    return (w12 / (w1 * w2).clamp(min=eps)).squeeze().sum(0)


