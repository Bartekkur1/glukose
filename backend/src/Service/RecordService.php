<?php

namespace App\Service;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\MealPart;
use App\Entity\Sugar;
use App\Entity\User;
use App\Entity\Dose;
use App\Entity\Meal;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RecordService
{
    private $em;
    private $validator;

    public function __construct(EntityManagerInterface $em, ValidatorInterface $validator)
    {
        $this->em = $em;
        $this->validator = $validator;
    }

    private function getRepository($type)
    {
        if(strtolower($type) == "sugar")
            return $this->em->getRepository(Sugar::class);
        else if(strtolower($type) == "dose")
            return $this->em->getRepository(Dose::class);
        else if(strtolower($type) == "meal")
            return $this->em->getRepository(Meal::class);
        else
            throw new BadRequestHttpException("Podano zły typ danych");
    }

    public function new($user, $type, $data)
    {
        $object = $this->getRepository($type);
        $record_type = "App\Entity\\" . ucfirst($type); 
        $record = new $record_type;
        $record->setUser($user);
        $record->updateFromInput($data);
        $errors = $this->validator->validate($record);
        if(count($errors) > 0)
            throw new BadRequestHttpException($errors[0]->getMessage());
        $this->em->persist($record);
        $this->em->flush();
        return $record->getId();
    }

    public function update($user, $type, $data)
    {
        $object = $this->getRepository($type);
        if(!$data["id"])
            throw new BadRequestHttpException("Nie podano id rekordu");
        
        if(!$record = $object->findOneBy(["id" => $data["id"]]))
            throw new BadRequestHttpException("Rekord nie istnieje");

        if($record->getUser()->getId() != $user->getId())
            throw new BadRequestHttpException("Nie posiadasz uprawnień do edycji tego rekordu");

        $record->updateFromInput($data);
        $this->em->persist($record);
        $this->em->flush();
    }

    public function delete($user, $type, $id)
    {
        $object = $this->getRepository($type);

        if(!$record = $object->findOneBy(["id" => $id]))
            throw new BadRequestHttpException("Rekord nie istnieje"); 
    
        if($record->getUser()->getId() != $user->getId())
            throw new BadRequestHttpException("Nie posiadasz uprawnień do edycji tego rekordu");
    
        $this->em->remove($record);
        $this->em->flush();
    }

    public function search($user, $type, $date, $range)
    {
        $object = $this->getRepository($type);

        if(!$date)
        {
            return [
                "avg" => $object->AvgAll($user->getId())[0],
                "max" => $object->Max($user->getId())[0],
                "min" => $object->Min($user->getId())[0],
                "values" => $object->findBy(["user" => $user->getId()])
            ];
        }
        else if($date && !$range)
        {
            if($date == "stats")
            {
                $response = array();
                foreach($object->AvgAll($user->getId()) as $record)
                    $response[$record[2]] = $record[1];
                return $response;
            }
            else if($date == "latest")
            {
                return ["date" => $object->Latest($user->getId())];
            }
            else if($date == "avghours")
            {
                if(!$arr = $object->AvgAllByHours($user->getid()))
                    $arr = [];
                return [
                    "values" => $arr,
                    "max" => max($arr),
                    "min" => min($arr),
                ];
            }

            return [
                "avg" => $object->AvgByDate($date, $user->getId())[0],
                "max" => $object->MaxDate($user->getId(), $date)[0],
                "min" => $object->MinDate($user->getId(), $date)[0],
                "values" => $object->AllByDate($date, $user->getId())
            ];
        }
        else if($date && $range)
            if($date == "id")
            {
                return ["value" => $object->findOneBy(["id" => $range])];
            }
            else
            {
                return [
                    "avg" => $object->AvgByRange($date, $range, $user->getId())[0],
                    "max" => $object->MaxDateRange($user->getId(), $date, $range)[0],
                    "min" => $object->MinDateRange($user->getId(), $date, $range)[0],
                    "values" => $object->AllByRange($date, $range, $user->getId())
                ];
            }

        throw new BadRequestHttpException("Coś poszło nie tak...");
    }
}