# USAGE EXAMPLES

## File Upload (POST):
#### Example Request:
```sh
curl -v -F target_file=@'Data.pdf' localhost:3000/api/upload
```
#### Example Response:
```json
{
	"file": "http://localhost:3000/api/file/83de4ba2-04b5-436d-b679-593c3e90fd05"
}
```

## File Query (GET):
#### Example Request:
```sh
curl -v http://localhost:3000/api/file/83de4ba2-04b5-436d-b679-593c3e90fd05
```
#### Example Response:
```json
{
	"filename": "Data.pdf",
	"filesize_nbytes": 77330,
	"upload_timestamp": "2024-03-21T16:49:54.330Z",
	"last_download_timestamp": null,
	"total_download_count": 0,
	"download_uri": "http://localhost:3000/api/download/83de4ba2-04b5-436d-b679-593c3e90fd05"
}
```
`"last_download_timestamp" and "total_download_count" are updated accordingly.`  
`"download_uri" is the file download link.`