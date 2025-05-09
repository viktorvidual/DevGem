import { useEffect, useState } from "react";
import { Version, getVersionsByAddonHandle } from "../../services/version.services";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from "@mui/joy";

export default function Versions({addonId}: {addonId: string}){

    const [versions, setVersions] = useState<Version[]>([])

    useEffect(()=>{

        (async()=>{

            try{
                const response = await getVersionsByAddonHandle(addonId)
                setVersions(response)
            }catch(error){
                console.log(error);
            }
            
        })()

    },[])

    return(
        
      <TableContainer component={Paper} sx={{mt:2, boxShadow: "none", border: "1px solid #DFDFE0"}}>
      <Table aria-label="addon-info-table">
        <TableHead>
          <TableRow>
            <TableCell>Info</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Upload Date</TableCell>
            <TableCell>Download Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {versions.map((item: Version)  => (
            <TableRow key={item.versionId}>
              <TableCell>{item.info}</TableCell>
              <TableCell>{item.version}</TableCell>
              <TableCell>{new Date(item.createdOn).toLocaleDateString()}</TableCell>
              <TableCell><Link href={item.downloadLink} target="_blank" rel="noopener noreferrer">Download</Link></TableCell>
            </TableRow> 
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        
    )
    
}