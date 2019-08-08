from models import Sample
import pickle as pkl



def gen_corpus_feature(corpus_path, corpus_feature_path, emb_path):
    sample = Sample(dic_path, corpus_path, emb_path)

    with open(corpus_path, 'r', encoding='utf-8', errors='ignore') as f:
        sentences = f.readlines()

    corpus_feature = {'index' : [], 'feature' : []}
    idx = 0
    for sentence in sentences:
        corpus_feature['feature'].append(sample.get_feature(sentence))
        corpus_feature['index'].append(idx)
        idx += 1

    with open(corpus_feature_path, 'wb') as f:
        pkl.dump(corpus_feature, f)

if __name__ == '__main__':
    dic_path = "./zhs.model/char_dic.json"
    emb_path = "./ChineseELMo.hdf5"
    corpus_path = "./corpus.txt"
    corpus_feature_path = "./corpus_feature.pkl"
    gen_corpus_feature(corpus_path, corpus_feature_path, emb_path)