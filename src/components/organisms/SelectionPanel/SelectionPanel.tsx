import { useState } from 'react'
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'

type Option = {
  id: string
  title: string
  description: string
  imageUrl: string
}

type SelectionPanelProps = {
  options: Option[]
  multiple?: boolean
  onSelectionChange?: (selected: Option | null) => void
}

const SelectionPanel = ({
  options,
  multiple = false,
  onSelectionChange,
}: SelectionPanelProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

 const handleSelect = (option: Option) => {
  setSelectedId(option.id)
  onSelectionChange?.(option)
}


  return (
    <Grid container spacing={3}>
      {options.map((option) => (
        <Grid item xs={12} sm={6} md={4} key={option.id}>
          <Card
            sx={{
              border: selectedId === option.id ? '2px solid #0077ff' : '2px solid transparent',
              boxShadow: selectedId === option.id ? '0 0 8px #0077ff' : 'none',
              transition: 'all 0.3s',
            }}
          >
            <CardActionArea onClick={() => handleSelect(option)}>
              <CardMedia
                component="img"
                height="160"
                image={option.imageUrl}
                alt={option.title}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {option.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default SelectionPanel