import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import FormDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import MenuItem from '@mui/material/MenuItem';
import '../css/MyPets.css'
import TokenService from "../services/TokenService";
import PetService from "../services/PetService";

const MyPets = () => {

    
    const [open, setOpen] = useState(false)
    const[mypets, setMyPets] = useState([])
    const [selectedOption, setSelectedOption] = useState('')
    const[dateOfBirth, setDateOfBirth] = useState(new Date())
    const [petName, setPetName] = useState('')
    const [des,setDescription] = useState('')
    const [petGender, setGender] = useState('')
    const [showSuccessMessage, setShowSuccessMessage] = useState(sessionStorage.getItem('showSuccessMessage'));
    const [deleteState, setDeleteState] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [petId, setPetId] = useState(0);


    const options = ['Dog', 'Cat', 'Bird']
    const gender = ['Male','Female','Other']

    const pet = {
        token: TokenService.getAccessToken(),
        ownerId: TokenService.getClaims().userId,
        name: petName,
        gender: petGender.toUpperCase(),
        birthday: dateOfBirth,
        type: selectedOption,
        information: des
    };

    useEffect(() => {
        const getAllPets = async () => {
            const usrId = TokenService.getClaims().userId
            const token = TokenService.getAccessToken()
            const response = await PetService.getPetsByOwnerId(usrId,token)

            console.log(response)

            if(response && response.pets){
                setMyPets(response.pets)
            }
            
        }
        getAllPets()
        sessionStorage.setItem('showSuccessMessage',false)

    },[])

    

    const createPet = () => {
        try {
            console.log(petName)
            console.log(selectedOption)

            const newPet = PetService.registerPet(pet);
            if (newPet) {
                setShowSuccessMessage(true);
                sessionStorage.setItem("needsReload", true);
                
            }
        } catch (error) {
            console.error('Error registering pet:', error);
            setShowSuccessMessage(false);
        }
    };

    const updatePet = () => {
        try{
            console.log(petName)
            console.log(des)

            const newPet = {
                token: TokenService.getAccessToken(),
                id: petId,
                ownerId: TokenService.getClaims().userId,
                name: petName,
                information: des
            }

            PetService.updatePet(newPet);

            setShowSuccessMessage(true);

            sessionStorage.setItem("needsReload", true);
            
        }catch(error){
            console.log('Error update pet', error)
        }
    }

    const handleDeletePet = (id) => {
        try {

            const userToken = TokenService.getAccessToken();
            PetService.deletePet(id,userToken);

            setShowSuccessMessage(true);
    
            sessionStorage.setItem("needsReload", true);

        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleUpdateOpen = (petId) => {
        setPetId(petId)
        setOpenUpdateDialog(true)
    }

    const handleUpdateClose = () => {
        setOpenUpdateDialog(false);
        updatePet();
        sessionStorage.setItem("needsReload", true)
    }

    const handleClose = () => {
        setOpen(false);
        createPet(); 
    };

    const reload = sessionStorage.getItem("needsReload");
    
    if(reload === "true"){
        sessionStorage.setItem('showSuccessMessage', JSON.stringify(showSuccessMessage));
        sessionStorage.setItem("needsReload", false);
        window.location.reload();
    }
    

    const convertBirthday = (pet) =>{
        const birthday = new Date(pet.birthday);

        const petBirthday = birthday.toISOString().split('T')[0];

        return petBirthday;
    }


    return (  
        <div className="pets-page" style={{ backgroundImage: "url('paws.jpg')" }}>
            <div className="pets-content">
                <h1>My pets: </h1>

            <div className="pets-cards">
                {mypets.map(p => 
                        <div  data-testid="cypress-createNewPet-petCardContent" className='petCardContent' key={p.id}>
                            <div className='text-pets'>
                                <h4>{p.name}</h4>
                                <p>Species: {p.type}</p> 
                                <p>Gender: {p.gender.toLowerCase()}</p>
                                <p>Birthday: {convertBirthday(p)}</p>
                                <p>Information: {p.information} </p>
                                <button onClick={() => handleUpdateOpen(p.id)}>Update</button>
                                <button data-testid="cypress-createNewPet-deleteBtn" onClick={() => handleDeletePet(p.id)}>Remove</button>
                            </div>
                        </div>
                    )}
            </div>


                <Button  data-testid="cypress-openCreateDialog-openDialogBtn" variant="outlined" onClick={handleClickOpen}>
                    Add new pet 
                </Button>
                <FormDialog  data-testid="cypress-openCreateDialog-CreateDialog" open={open} onClose={handleClose}>
                    <DialogTitle>Register new pet</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please register your pet with VALID information so the doctors can keep track of your companions perfect health.
                                Don't worry you will be able to edit this later. 
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Pet name*"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={e => {
                                    setPetName(e.target.value)
                                }}
                                data-testid= "cypress-createNewPet-nameInput"
                            />
                            <label>Gender*</label>
                            <Select data-testid= "cypress-createNewPet-genderDropdown" label="Gender" variant="outlined" placeholder="Gender" className="input-field" value={petGender} onChange={(e) => setGender(e.target.value)}>
                                {gender.map((choice) => (
                                    <MenuItem key={choice} value={choice}>
                                    {choice}
                                    </MenuItem>
                                ))}
                            </Select>
                            <label>Type of animal*</label>
                            <Select data-testid= "cypress-createNewPet-typeOfAnimalDropdown" label="Type of animal" variant="outlined" className="input-field" value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
                                {options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                    {option}
                                    </MenuItem>
                                ))}
                            </Select>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                label="Date Of Birth"
                                value={dateOfBirth}
                                onChange={(newDate) => setDateOfBirth(newDate)}
                                renderInput={(params) => (<TextField {...params} variant="outlined" className="date-picker" />)}
                            />
                            </LocalizationProvider>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="description"
                                label="Description of health condition*"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={e => {
                                    setDescription(e.target.value)
                                }}  
                                data-testid= "cypress-createNewPet-descriptionInput"
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button data-testid="cypress-openCreateDialog-closeDialogBtn" onClick={handleClose}>Cancel</Button>
                        <Button data-testid= "cypress-createNewPet-saveDialogBtn" onClick={handleClose}>Save</Button>
                        </DialogActions>
                </FormDialog>

                <FormDialog open={openUpdateDialog} onClose={handleUpdateClose}>
                    <DialogTitle>Update pet</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                               Please update the information of your pet with the latest medical changes.
                               You don't want to deteriorate the doctors in helping your pet maintain perfect health!
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Pet name"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={e => {
                                    setPetName(e.target.value)
                                }}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="description"
                                label="Description of health condition"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={e => {
                                    setDescription(e.target.value)
                                }}  
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleUpdateClose}>Cancel</Button>
                        <Button onClick={handleUpdateClose}>Update</Button>
                        </DialogActions>
                </FormDialog>
                {showSuccessMessage === "true" && <p>Success!</p>}
            </div>
        </div>
       
    );
}
 
export default MyPets;