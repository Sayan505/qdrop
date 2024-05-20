# USAGE EXAMPLES

## File Upload (POST):
#### Example Request:
```sh
# "multipart/form-data"
curl -v -F target_file=@'./Data.pdf' -F expire_in='5mins' localhost:3000/api/upload
```
`The "/api/upload/" route is rate limited to 2 requests per minute based on IP.`  
`Upload size limit is 256 MiB and limited to "non-executable" file types only.`  
`Available values for "expire_in" (optional): "5mins", "30mins", "1hrs", "2hrs", "5hrs", "12hrs", "24hrs"/"1day", "2days" and "7days", else default ("30mins").`

#### Example Response:
```json
{
	"file_url": "localhost:3000/api/file/00YzBjLWFlZm"
}
```

## File Query & Download (GET):
#### Example Request:
```sh
curl -v http://localhost:3000/api/file/00YzBjLWFlZm    # the "file_url"
```
#### Example Response:
```json
{
  "filename": "Data.pdf",
  "filesize_nbytes": 8026081,
  "upload_timestamp": "2024-05-20T11:30:34.612Z",
  "last_download_timestamp": null,
  "total_download_count": 0,
  "download_uri": "localhost:3000/api/file/download/00YzBjLWFlZm"
}
```
`"last_download_timestamp" and "total_download_count" are updated accordingly.`  
`"download_uri" is the file download link.`  
