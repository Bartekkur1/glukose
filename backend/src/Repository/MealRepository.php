<?php

namespace App\Repository;

use App\Entity\Meal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Meal|null find($id, $lockMode = null, $lockVersion = null)
 * @method Meal|null findOneBy(array $criteria, array $orderBy = null)
 * @method Meal[]    findAll()
 * @method Meal[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MealRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Meal::class);
    }

    public function Latest($user)
    {
        $response = $this->createQueryBuilder('s')
            ->select('MAX(s.date) as date')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
        return $response[0]["date"];
    }

    public function Min($user)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.kcal) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->orderBy('s.kcal', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function Max($user)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.kcal) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MinDate($user, $date)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.kcal) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date = :date')
            ->setParameter('date', $date)
            ->orderBy('s.kcal', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MaxDate($user, $date)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.kcal) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date = :date')
            ->setParameter('date', $date)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MinDateRange($user, $date, $range)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.kcal) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date > :date')
            ->setParameter('date', $date)
            ->andWhere('s.date < :range')
            ->setParameter('range', $range)
            ->orderBy('s.kcal', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MaxDateRange($user, $date, $range)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.kcal) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date > :date')
            ->setParameter('date', $date)
            ->andWhere('s.date < :range')
            ->setParameter('range', $range)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function AvgAll($user)
    {
        return $this->createQueryBuilder('m')
            ->select('avg(m.kcal) as value')
            ->andWhere('m.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function AvgByDate($date, $user)
    {
        return $this->createQueryBuilder('m')
            ->select('avg(m.kcal) as value')
            ->andWhere('m.date = :date')
            ->andWhere('m.user = :user')
            ->setParameter('user', $user)
            ->setParameter('date', $date)
            ->orderBy('m.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    public function AvgByRange($date, $range, $user)
    {
        return $this->createQueryBuilder('m')
            ->select('avg(m.kcal) as value')
            ->andWhere('m.user = :user')
            ->setParameter('user', $user)
            ->andWhere('m.date > :date')
            ->setParameter('date', $date)
            ->andWhere('m.date < :range')
            ->setParameter('range', $range)
            ->orderBy('m.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    public function AvgAllByHours($user)
    {
        return $this->createQueryBuilder('m')
            ->select('avg(m.kcal) as value, HOUR(m.date) as hour')
            ->groupBy('hour')
            ->andWhere('m.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function AllByDate($date, $user)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.user = :user')
            ->setParameter('user', $user)
            ->andWhere('m.date = :date')
            ->setParameter('date', $date)
            ->orderBy('m.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    public function AllByRange($date, $range, $user)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.date > :date')
            ->andWhere('m.user = :user')
            ->setParameter('user', $user)
            ->andWhere('m.date < :range')
            ->orderBy('m.date', 'ASC')
            ->setParameter('date', $date)
            ->setParameter('range', $range) 
            ->getQuery()
            ->execute();
    }


}
