# Uploading, changing metadata, and publishing via python API

```python

Upload_to_Nomad_functions.py - Python
#!/usr/bin/env python

import requests
import json

# Example inputs
# username = 'joseph.rudzinski@physik.hu-berlin.de'
# # production nomad
# nomad_url = 'https://nomad-lab.eu/prod/v1/api/v1/'
# # test nomad (deleted occassionally)
# nomad_url = 'https://nomad-lab.eu/prod/v1/test/api/v1/'

def get_authentication_token( nomad_url, username, password):
    try:
        response = requests.get(
            nomad_url+'auth/token', params=dict(username=username, password=password))
        token = response.json().get('access_token')
        if token:
            return token
        else:
            print('response is missing token: ')
            print(response.json())
            return
    except Exception:
        print('something went wrong trying to get authentication token')
        return

def create_dataset(nomad_url, token, dataset_name)
    try:
        # Get the dataset id
        response = requests.post(
            nomad_url+'datasets/',
            headers={'Authorization': f'Bearer {token}', 'Accept': 'application/json'},
            json={"dataset_name": dataset_name}
            )
        dataset_id = response.json().get('dataset_id')
        if dataset_id:
            return dataset_id
        else:
            print('response is missing dataset_id: ')
            print(response.json())
            return
    except Exception:
        print('something went wrong trying to create a dataset')
        return

def upload_to_NOMAD(nomad_url, token, upload_file):
    with open(upload_file, 'rb') as f:
        try:
            response = requests.post(
            nomad_url+'uploads',
            headers={'Authorization': f'Bearer {token}', 'Accept': 'application/json'},
            data=f)
            upload_id = response.json().get('upload_id')
            if upload_id:
                return upload_id
            else:
                print('response is missing upload_id: ')
                print(response.json())
                return
        except Exception:
            print('something went wrong uploading to NOMAD')
            return

def check_upload_status(nomad_url, token, upload_id):
    # upload success => returns 'Process publish_upload completed successfully'
    # publish success => 'Process publish_upload completed successfully'
    try:
        response = requests.get(
            nomad_url+'uploads/'+upload_id,
            headers={'Authorization': f'Bearer {token}'})
        status_message = response.json().get('data').get('last_status_message')
        if status_message:
            return status_message
        else:
            print('response is missing status_message: ')
            print(response.json())
            return
    except Exception:
        print('something went wrong trying to check the status of upload' + upload_id)
        # upload gets deleted from the upload staging area once published...or in this case something went wrong
        break

def edit_upload_metadata(nomad_url, token, upload_id, metadata):
    # Example of new metadata
    # upload_name = 'Atomistic_Sims_of_C7O2_Isomers_Upload_' + str(upload_number)
    # metadata = {
    #     "metadata": {
    #     "upload_name": upload_name,
    #     "references": ["https://doi.org/10.1063/5.0104914", "http://doi.org/10.5281/zenodo.6032826"],
    #     "datasets": dataset_id,
    #     "embargo_length": 0,
    #     "coauthors": ["bereau@thphys.uni-heidelberg.de"],
    #     "comment": 'Atomistic simulations of C7O2_Isomers.'
    #                ' These simulations are regenerations of the data used in https://doi.org/10.1063/5.0104914.'
    #                ' Note that production simulations were shortened to 20 ns each.',
    # },
    # }

    try:
        response = requests.post(
            nomad_url+'uploads/' + upload_id + '/edit',
            headers={'Authorization': f'Bearer {token}', 'Accept': 'application/json'},
            json=metadata
            )
        return response
    except Exception:
        print('something went wrong trying to add metadata to upload' + upload_id)
        return

def publish_upload(nomad_url, token, upload_id):
    try:
        response = requests.post(
            nomad_url+'uploads/' + upload_id + '/action/publish',
            headers={'Authorization': f'Bearer {token}', 'Accept': 'application/json'},
            )
        return response
    except Exception:
        print('something went wrong trying to publish upload: ' + upload_id)
        return
```