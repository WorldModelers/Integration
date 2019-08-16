import os
import re
import json
import numpy as np
import pandas
from pysb.simulator import ScipyOdeSimulator
from indra.sources import eidos
from IPython.display import Image
from indra.assemblers.graph import GraphAssembler
from indra.assemblers.cag import CAGAssembler
import random
import datetime

EIDOS_WS_URL = 'http://localhost:9000/'
SOURCE_DIRECTORY = '/home/cwilliams/M20_Shaved/extracted/'
DESTINATION_DIRECTORY = '/home/cwilliams/M20_Shaved/extracted_processed'

success_count = 0
failure_count = 0
non_zero_count = 0
start_time = datetime.datetime.now()
files = []

def fix_periods(contents):
    fixed = re.sub(r'\s*\n\s*\n\s*', '.\n\n', contents)
    fixed = re.sub(r'\.\.', '.', fixed)
    fixed = fixed.replace('\n','') # Brandon added this...not sure if it matters
    return fixed


def run_indra(doc):
    text = fix_periods(doc['extracted_text'])
    ep = eidos.process_text(text, webservice=EIDOS_WS_URL)
    statements = [i.to_json() for i in ep.statements]
    return statements

for file in os.listdir(SOURCE_DIRECTORY):
    files.append(f"{SOURCE_DIRECTORY}{file}")

# for file in random.sample(files, 125):
for file in files:
  try:
    # generate INDRA_statements and write output file
    print(f'reading file {file}')
    with open(file,'r') as f:
        doc = json.loads(f.read())

    INDRA_statements = run_indra(doc)
    if len(INDRA_statements) > 0:
      non_zero_count += 1
    doc['INDRA_statements'] = INDRA_statements

    file_name = file.split('extracted')[1]

    with open(f'{DESTINATION_DIRECTORY}{file_name}','w+') as f:
        f.write(json.dumps(doc))
    success_count += 1
  except Exception as e:
    failure_count += 1
    with open('errors_log.txt', 'a') as logfile:
        logfile.write(f"{file_name}: {e}\n\n")

end_time = datetime.datetime.now()
print("Start time --- %s" % (start_time,))
print("End time --- %s" % (end_time,))
print("Total Success --- %s" % (success_count,))
print("Total Failed --- %s" % (failure_count,))
print("Total Non-Zero INDRA_statements array --- %s" % (non_zero_count,))