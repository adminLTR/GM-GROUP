import pandas as pd

archivo = '/Users/marceloasencio/Documents/buscadorpersona/provedoresdelestadouy.csv'
df = pd.read_csv(archivo, dtype=str)
print(df.columns.tolist())
