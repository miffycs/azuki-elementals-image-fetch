import requests
import time
import pandas as pd
from concurrent.futures import ThreadPoolExecutor

def check_missing_ids(file_csv, id_range):
    df = pd.read_csv(file_csv, usecols=['id'])
    all_ids = set(range(id_range))
    csv_ids = set(df['id'])
    missing_ids = list(all_ids - csv_ids)

    print('Unrevealed:', len(missing_ids))

    return missing_ids


def fetch_id(id):
    base_url = "https://elementals-metadata.azuki.com/elemental/"
    url = base_url + str(id)
    try:
        response = requests.get(url)
        if response.status_code != 403:
            data = response.json()
            image = data.get('image')
            if image is not None:
                slug = image[36:72]
                return id, slug
    except Exception as e:
        print(f"Error with ID {id}: {str(e)}")
    return None


def fetch_new_reveals(file_csv, id_range, batch_size, sleep_time):
    missing_ids = check_missing_ids(file_csv, id_range)
    image_dict = {}

    with ThreadPoolExecutor(max_workers=batch_size) as executor:
        for i in range(0, len(missing_ids), batch_size):
            batch = missing_ids[i:i+batch_size]
            print('Fetching batch = ' + str(batch))
            results = executor.map(fetch_id, batch)
            for result in results:
                if result is not None:
                    id, slug = result
                    image_dict[id] = slug
                    print(id, slug)
            time.sleep(sleep_time)

    df = pd.DataFrame(list(image_dict.items()), columns=['id', 'slug'])
    df.to_csv(file_csv, mode='a', header=False, index=False)

    if image_dict:
        print('Added to CSV:')
        print(image_dict)
        sort_csv(file_csv)
    else:
        print('No entries added')


def sort_csv(file_csv):
    df = pd.read_csv(file_csv)
    df = df.sort_values(by='id')
    df.to_csv(file_csv, index=False)


def csv_to_js(file_csv, file_js):
    df = pd.read_csv(file_csv)

    js_object = ',\n\t'.join(f'{row["id"]}: "{row["slug"]}"' for index, row in df.iterrows())
    js_object = f'const slugs = {{\n\t{js_object}\n}};'

    with open(file_js, 'w') as f:
        f.write(js_object)
    print('Converted CSV to JS object')
    

def main():
    # URL_METADATA = "https://elementals-metadata.azuki.com/elemental/"
    # URL_IMAGE = "https://elementals-images.azuki.com/{slug}(-bigazuki).png"
    TOKEN_COUNT = 20000
    FILE_CSV = 'image_data.csv'
    FILE_JS = 'slugs.js'

    # Fetch the image slugs for a single ID
    # print(fetch_id(1695))

    BATCH_SIZE = 100
    SLEEP_TIME = 0.01
    fetch_new_reveals(FILE_CSV, TOKEN_COUNT, BATCH_SIZE, SLEEP_TIME)

    # Conver the CSV file to a JavaScript object
    csv_to_js(FILE_CSV, FILE_JS)


if __name__ == "__main__":
    main()

