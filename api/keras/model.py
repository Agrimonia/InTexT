import keras
from keras.models import Sequential
from keras.layers import Input, Dense, Dropout, Embedding, LSTM, BatchNormalization

max_length = 20

class Model():
  """docstring for model"""
  def __init__(self, max_length=20):
    super(Model, self).__init__()
    self.max_length = max_length

  def build_model(self, max_index=2000, output_dim=10):
    self.model = Sequential()
    self.model.add(Embedding(max_index, output_dim, input_length=max_length))
    self.model.add(Dense(units=100, activation='relu'))
    self.model.add(LSTM(output_dim=50,
                   activation='relu',
                   inner_activation='hard_sigmoid'))
    self.model.add(Dropout(0.5))
    self.model.add(Dense(10, activation='relu'))
    self.model.add(Dropout(0.5))
    self.model.add(BatchNormalization())
    self.model.add(Dense(1))

  def compile(self, loss='squared_hinge', optimizer='adam', metrics=['accuracy']):
    self.model.compile(loss=loss,
                 optimizer=optimizer,
                 metrics=metrics)

  def train(self, X_train=None, y_train=None, batch_size=32, epochs=50):
    self.model.fit(x=X_train, y=y_train, batch_size=batch_size, epochs=epochs)

  def predict(self, x=None):
    return self.model.predict(x)
    
  def save_model(self, save_path='saved_model'):
    self.model.save(save_path)
