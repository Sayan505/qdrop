# USAGE EXAMPLES

## File Upload (POST):
#### Example Request:
```sh
curl -v -F target_file=@'./Data.pdf' -F expire_in='5mins' localhost:3000/api/upload
```
`The "/api/upload/" route is rate limited to 2 requests per minute based on IP.`  
`Upload size limit is 256 MiB and limited to "non-executable" file types only.`

#### Example Response:
```json
{
	"file_url": "localhost:3000/api/file/0e4cb48a-b68a-4f25-a47a-8a2413d03c56"
}
```

## File Query (GET):
#### Example Request:
```sh
curl -v http://localhost:3000/api/file/0e4cb48a-b68a-4f25-a47a-8a2413d03c56    # the "file_url"
```
#### Example Response:
```json
{
  "filename": "Data.pdf",
  "filesize_nbytes": 8026081,
  "upload_timestamp": "2024-05-20T09:24:15.729Z",
  "last_download_timestamp": null,
  "total_download_count": 0,
  "download_uri": "localhost:3000/api/file/download/0e4cb48a-b68a-4f25-a47a-8a2413d03c56"
}
```
`"last_download_timestamp" and "total_download_count" are updated accordingly.`  
`"download_uri" is the file download link.`  
